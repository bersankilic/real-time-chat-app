package com.bersan.chatapp;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.bersan.chatapp.dto.*;
import com.bersan.chatapp.model.Role;
import com.bersan.chatapp.model.UserEntity;
import com.bersan.chatapp.repository.RoleRepository;
import com.bersan.chatapp.repository.UserRepository;
import com.bersan.chatapp.security.JwtGenerator;
import com.bersan.chatapp.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private JwtGenerator jwtGenerator;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private HttpServletResponse response;
    
    @InjectMocks
    private UserService userService;
    
    @Mock
    private RoleRepository roleRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    
    
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    
    // login metodu test
    @Test
    public void testLogin_Success() {
      
        LoginDto loginDto = new LoginDto();
        loginDto.setUsername("testuser");
        loginDto.setPassword("password");
        
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testuser");
        userEntity.setNickname("Test User");
        userEntity.setProfileImg("profile.jpg");
        userEntity.setFirstLogin(true);
        
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userEntity));
        when(jwtGenerator.generateCookie(authentication)).thenReturn(new Cookie("token", "jwt-token"));
        
     
        ResponseEntity<?> responseEntity = userService.login(loginDto, response);
        
     
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertTrue(responseEntity.getBody() instanceof LoginResponseDto);
        LoginResponseDto loginResponseDto = (LoginResponseDto) responseEntity.getBody();
        assertEquals("Test User", loginResponseDto.getUserNickname());
        assertEquals("profile.jpg", loginResponseDto.getImagePath());
        assertTrue(loginResponseDto.isFirstLogin());
    }
    
    @Test
    public void testLogin_UserNotFound() {
        
        LoginDto loginDto = new LoginDto();
        loginDto.setUsername("unknownuser");
        loginDto.setPassword("password");
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Authentication failed"));
        
    
        ResponseEntity<?> responseEntity = userService.login(loginDto, response);
 
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Authentication failed", responseEntity.getBody());
    }
    
    // register metodu test
    
    @Test
    public void testRegister_Success() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setUsername("newuser");
        registerDto.setPassword("password");
        registerDto.setConfirmPassword("password");
        registerDto.setProfileImg("profile.jpg");
        registerDto.setNickname("New User");
        
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        Role userRole = new Role();
        userRole.setName("USER");
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        
        ResponseEntity<String> responseEntity = userService.register(registerDto);
        
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Kayıt işlemi başarılı", responseEntity.getBody());
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }
    
    @Test
    public void testRegister_UsernameAlreadyExists() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setUsername("existinguser");
        registerDto.setPassword("password");
        registerDto.setConfirmPassword("password");
        
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);
        
        ResponseEntity<String> responseEntity = userService.register(registerDto);
        
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Kullanıcı adı zaten alındı!", responseEntity.getBody());
        verify(userRepository, never()).save(any(UserEntity.class));
    }
    
    @Test
    public void testRegister_PasswordsDoNotMatch() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setUsername("newuser");
        registerDto.setPassword("password");
        registerDto.setConfirmPassword("differentPassword");
        
        ResponseEntity<String> responseEntity = userService.register(registerDto);
        
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Parolalar eşleşmiyor", responseEntity.getBody());
        verify(userRepository, never()).save(any(UserEntity.class));
    }
    
    // deleteUserByUsername metodu test
    
    @Test
    public void testDeleteUserByUsername_Success() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testuser");
        
        when(jwtGenerator.getUserNameFromJWTCookies(request)).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userEntity));
        
        ResponseEntity<?> responseEntity = userService.deleteUserByUsername(request);
        
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Kullanıcı silindi!", responseEntity.getBody());
        verify(userRepository, times(1)).deleteUserByUsername("testuser");
    }
    
    @Test
    public void testDeleteUserByUsername_UserNotFound() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        
        when(jwtGenerator.getUserNameFromJWTCookies(request)).thenReturn("unknownuser");
        when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());
        
        ResponseEntity<?> responseEntity = userService.deleteUserByUsername(request);
        
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        assertEquals("Kullanıcı bulunamadı", responseEntity.getBody());
        verify(userRepository, never()).deleteUserByUsername(anyString());
    }
    
    @Test
    public void testDeleteUserByUsername_Exception() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        
        when(jwtGenerator.getUserNameFromJWTCookies(request)).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenThrow(new RuntimeException("Database error"));
        
        ResponseEntity<?> responseEntity = userService.deleteUserByUsername(request);
        
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Database error", responseEntity.getBody());
        verify(userRepository, never()).deleteUserByUsername(anyString());
    }
    
    // checkIsFriendOnlineByNickname metodu test
    @Test
    public void testCheckIsFriendOnlineByNickname_Success() {
        String nickname = "friendNickname";
        FriendIsOnlineDto friendIsOnlineDto = new FriendIsOnlineDto();
        friendIsOnlineDto.setIsOnline(true);
        
        when(userRepository.isFriendOnline(nickname)).thenReturn(friendIsOnlineDto);
        
        ResponseEntity<?> responseEntity = userService.checkIsFriendOnlineByNickname(nickname);
        
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(friendIsOnlineDto, responseEntity.getBody());
    }
    
    @Test
    public void testCheckIsFriendOnlineByNickname_Exception() {
        String nickname = "friendNickname";
        
        when(userRepository.isFriendOnline(nickname)).thenThrow(new RuntimeException("Database error"));
        
        ResponseEntity<?> responseEntity = userService.checkIsFriendOnlineByNickname(nickname);
        
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("Database error", responseEntity.getBody());
    }
    
    // searchUsersByNicknamePrefix metodu test
    @Test
    public void testSearchUsersByNicknamePrefix_Success() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String prefix = "test";
        String searcherUsername = "searcher";
        String searcherNickname = "searcherNickname";
        Integer searcherId = 1;
        
        UserEntity searcher = new UserEntity();
        searcher.setUsername(searcherUsername);
        searcher.setNickname(searcherNickname);
        searcher.setId(searcherId);
        
        SearchUserResponseDto dto = new SearchUserResponseDto();
        dto.setUserId(2);
        dto.setNickname("testUser");
        
        UserEntity foundUser = new UserEntity();
        foundUser.setId(2);
        foundUser.setNickname("testUser");
        
        when(jwtGenerator.getUserNameFromJWTCookies(request)).thenReturn(searcherUsername);
        when(userRepository.findByUsername(searcherUsername)).thenReturn(Optional.of(searcher));
        when(userRepository.findByNicknamePrefix("%" + prefix + "%", searcherNickname))
                .thenReturn(Optional.of(Collections.singletonList(dto)));
        when(userRepository.findById(dto.getUserId())).thenReturn(Optional.of(foundUser));
        
        ResponseEntity<?> responseEntity = userService.searchUsersByNicknamePrefix(prefix, request);
        
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertTrue(responseEntity.getBody() instanceof List<?>);
        List<?> responseBody = (List<?>) responseEntity.getBody();
        assertEquals(1, responseBody.size());
        assertTrue(responseBody.get(0) instanceof SearchUserResponseDto);
        SearchUserResponseDto responseDto = (SearchUserResponseDto) responseBody.get(0);
        assertEquals("testUser", responseDto.getNickname());
    }
    
    @Test
    public void testSearchUsersByNicknamePrefix_Unauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String prefix = "test";
        
        when(jwtGenerator.getUserNameFromJWTCookies(request)).thenReturn(null);
        
        ResponseEntity<?> responseEntity = userService.searchUsersByNicknamePrefix(prefix, request);
        
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        assertEquals("Yetkisiz işlem", responseEntity.getBody());
    }
    
    @Test
    public void testSearchUsersByNicknamePrefix_NoMatches() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        String prefix = "test";
        String searcherUsername = "searcher";
        String searcherNickname = "searcherNickname";
        
        UserEntity searcher = new UserEntity();
        searcher.setUsername(searcherUsername);
        searcher.setNickname(searcherNickname);
        
        when(jwtGenerator.getUserNameFromJWTCookies(request)).thenReturn(searcherUsername);
        when(userRepository.findByUsername(searcherUsername)).thenReturn(Optional.of(searcher));
        when(userRepository.findByNicknamePrefix("%" + prefix + "%", searcherNickname))
                .thenReturn(Optional.empty());
        
        ResponseEntity<?> responseEntity = userService.searchUsersByNicknamePrefix(prefix, request);
        
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Eşleşme yok", responseEntity.getBody());
    }
    
}
