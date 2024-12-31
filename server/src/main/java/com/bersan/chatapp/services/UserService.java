package com.bersan.chatapp.services;

import com.bersan.chatapp.dto.*;
import com.bersan.chatapp.model.*;
import com.bersan.chatapp.repository.FriendshipRepository;
import com.bersan.chatapp.repository.RoleRepository;
import com.bersan.chatapp.repository.UserRepository;
import com.bersan.chatapp.security.JwtGenerator;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private JwtGenerator jwtGenerator;
    private AuthenticationManager authenticationManager;
    private SimpMessagingTemplate simpMessagingTemplate;
    private FriendshipRepository friendshipRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder, JwtGenerator jwtGenerator, AuthenticationManager authenticationManager,
            FriendshipRepository friendshipRepository,
            SimpMessagingTemplate simpMessagingTemplate) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
        this.authenticationManager = authenticationManager;
        this.friendshipRepository = friendshipRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;

    }

    
    /*
        Bu metot kullanıcı girişini yapar ve JWT tokeni oluşturur.
        Ayrıca kullanıcıya JWT tokeni içeren bir cookie döner.
     */
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {

        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<UserEntity> user = userRepository.findByUsername(loginDto.getUsername());
            if (user.isPresent()) {
                Cookie jwtCookie = jwtGenerator.generateCookie(authentication);
                response.addCookie(jwtCookie);
                UserEntity currentUser = user.get();
                LoginResponseDto loginResponseDto = new LoginResponseDto(currentUser.getNickname(),
                        currentUser.getProfileImg(), currentUser.isFirstLogin());
                return new ResponseEntity<>(loginResponseDto, HttpStatus.OK);
            } else
                return new ResponseEntity<>("Kullanıcı bulunamadı", HttpStatus.NOT_FOUND);

        } catch (Exception e) {

            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    // Kullanıcı kaydı yapar
    public ResponseEntity<String> register(RegisterDto registerDto) {
        try {
            if (userRepository.existsByUsername((registerDto.getUsername()))) {
                return new ResponseEntity<>("Kullanıcı adı zaten alındı!", HttpStatus.BAD_REQUEST);
            }

            if (registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
                UserEntity user = new UserEntity();
                user.setUsername(registerDto.getUsername());
                user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
                user.setProfileImg(
                        registerDto.getProfileImg());
                user.setNickname(user.generateEncodedNickname(registerDto.getNickname()));
                user.setFirstLogin(true);

                Role roles = roleRepository.findByName("USER").get(); // USER rolü verildi
                user.setRoles(Collections.singletonList(roles));
                userRepository.save(user);

                return new ResponseEntity<>("Kayıt işlemi başarılı", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Parolalar eşleşmiyor", HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    
    
    // Kullanıcıyı siler
    public ResponseEntity<?> deleteUserByUsername(HttpServletRequest request) {
        try {
            Optional<UserEntity> op = userRepository
                    .findByUsername(jwtGenerator.getUserNameFromJWTCookies(request));
            if (op.isPresent()) {
                String usernameToDelete = op.get().getUsername();
                userRepository.deleteUserByUsername(usernameToDelete);
                return new ResponseEntity<>("Kullanıcı silindi!", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Kullanıcı bulunamadı", HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    
    // bir kullanıcının çevrimiçi olup olmadığını dön
    public ResponseEntity<?> checkIsFriendOnlineByNickname(String nickname) {
        try {
            FriendIsOnlineDto friendIsOnlineDto = userRepository.isFriendOnline(nickname);
            return new ResponseEntity<>(friendIsOnlineDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    
    // kullanıcının profil resmini günceller ve çevrimiçi arkadaşlarına bu güncellemeyi bildirir
    public ResponseEntity<?> updateProfileImage(UpdateProfileImgDto profileImgDto, HttpServletRequest request) {
        try {
            String opName = jwtGenerator.getUserNameFromJWTCookies(request);
            Optional<UserEntity> op = userRepository.findByUsername(opName);
            if (op.isPresent()) {
                UserEntity opUser = op.get();
                userRepository.updateProfileImage(opName, profileImgDto.getImagePath(), false);
                UpdateProfileResponseDto responseDto = new UpdateProfileResponseDto(profileImgDto.getImagePath(),
                        false);
                Optional<List<FriendDto>> friendsOptional = friendshipRepository.getOnlineFriends(opUser.getId());

                friendsOptional.ifPresent(friends -> {
                    List<String> onlineFriendNames = friends.stream()
                            .map(FriendDto::getNickname)
                            .collect(Collectors.toList());

                    onlineFriendNames.forEach(name -> {
                        FriendIsOnlineDto friend = new FriendIsOnlineDto(profileImgDto.getImagePath(),
                                opUser.getNickname(),
                                true);
                        Notification notification = new Notification(
                                opUser.getNickname() + " profilini güncellendi",
                                com.bersan.chatapp.model.MessageType.FRIEND_UPDATED_IMG, friend);
                        simpMessagingTemplate.convertAndSendToUser(name, "/queue/notifications",
                                notification);

                    });

                });

                return new ResponseEntity<>(responseDto, HttpStatus.OK);

            } else {
                return new ResponseEntity<>("Yetkisiz işlem", HttpStatus.UNAUTHORIZED);
            }
        } catch (

        Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    
    // kullanıcının sisteme ilk girişi ise profil resmi yüklemesini ister ardından isFirstLogin'i false yapar
    public ResponseEntity<?> updateProfileFirstLogin(HttpServletRequest request) {
        try {
            String opUsername = jwtGenerator.getUserNameFromJWTCookies(request);
            if (userRepository.existsByUsername(opUsername)) {
                userRepository.updateProfileFirstLogin(opUsername, false);
                UpdateFirstLoginResponseDto responseDto = new UpdateFirstLoginResponseDto(false);

                return new ResponseEntity<>(responseDto, HttpStatus.OK);

            } else {
                return new ResponseEntity<>("Yetkisiz işlem", HttpStatus.UNAUTHORIZED);
            }
        } catch (

        Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

   
    public String getProfileImageByUsername(String username) {
        return userRepository.getProfileImageByUsername(username);
    }


    public Optional<UserEntity> findByNickname(String nickname) {
        return userRepository.findByNickname(nickname);
    }

    

    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public String getNicknameByUsername(String username) {
        return userRepository.getNicknameByUsername(username);
    }

    public Boolean existsByNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    
    /*
        Bu metot, bir kullanıcının nickname ön ekiyle başlayan diğer kullanıcıları arar
        ve arkadaşlık durumlarını döner.
    */
    public ResponseEntity<?> searchUsersByNicknamePrefix(String prefix, HttpServletRequest request) {
        try {
            Optional<UserEntity> op = userRepository
                    .findByUsername(jwtGenerator.getUserNameFromJWTCookies(request));
            if (op.isPresent()) {
                String searcherNickname = op.get().getNickname();
                Integer searcherId = op.get().getId();
                Optional<List<SearchUserResponseDto>> searchedUsers = userRepository
                        .findByNicknamePrefix("%" + prefix + "%", searcherNickname);

                if (searchedUsers.isPresent()) {
                    List<SearchUserResponseDto> responseDtos = searchedUsers.get().stream().map(dto -> {
                        UserEntity user = userRepository.findById(dto.getUserId()).orElse(null);
                        if (user == null) {
                            return null;
                        }
                        FriendshiptStatus friendshipStatus = FriendshiptStatus.NOT_FRIENDS;
                        Integer friendRequestId = null;
                        for (Friendship sentRequest : user.getFriendshipsAsSender()) {
                            if (sentRequest.getReceiverEntity().getId().equals(searcherId)) {
                                friendRequestId = sentRequest.getId();
                                if (sentRequest.getStatus().equals(FriendshiptStatus.FRIENDS)) {
                                    friendshipStatus = FriendshiptStatus.FRIENDS;
                                } else {
                                    friendshipStatus = FriendshiptStatus.PENDING;
                                }
                                break;
                            } else if (sentRequest.getSenderEntity().getId().equals(searcherId)) {
                                friendRequestId = sentRequest.getId();
                                if (sentRequest.getStatus().equals(FriendshiptStatus.FRIENDS)) {
                                    friendshipStatus = FriendshiptStatus.FRIENDS;
                                } else {
                                    friendshipStatus = FriendshiptStatus.WAITING;
                                }
                                break;
                            }
                        }
                        for (Friendship receivedRequest : user.getFriendshipsAsReciever()) {
                            if (receivedRequest.getSenderEntity().getId().equals(searcherId)) {
                                friendRequestId = receivedRequest.getId();
                                if (receivedRequest.getStatus().equals(FriendshiptStatus.FRIENDS)) {
                                    friendshipStatus = FriendshiptStatus.FRIENDS;
                                } else {
                                    friendshipStatus = FriendshiptStatus.WAITING;
                                }
                                break;
                            }
                        }
                        dto.setStatus(friendshipStatus);
                        dto.setRequestId(friendRequestId);
                        return dto;
                    }).filter(Objects::nonNull).collect(Collectors.toList());

                    return new ResponseEntity<>(responseDtos, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Eşleşme yok", HttpStatus.OK);
                }

            } else {
                return new ResponseEntity<>("Yetkisiz işlem", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}