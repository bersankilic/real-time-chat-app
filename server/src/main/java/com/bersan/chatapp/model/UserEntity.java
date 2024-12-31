package com.bersan.chatapp.model;

import com.bersan.chatapp.dto.GetFriendRequestDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

// UserEntity sınıfı bir kullanıcıyı temsil eder.
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    @NotBlank
    @Email(message = "Geçersiz fırmat")
    private String username;

    private boolean isFirstLogin;

    @Column(unique = true)

    private String nickname;

    @NotBlank
    private String password;

    private String profileImg;

    private boolean isOnline;

    public UserEntity(int id, String profileImg, String nickname) {
        this.id = id;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }

    public UserEntity(String username) {
        this.username = username;
    }


    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> roles = new ArrayList<>();


    @OneToMany(mappedBy = "senderEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friendship> friendshipsAsSender = new ArrayList<>();
    

    @OneToMany(mappedBy = "receiverEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friendship> friendshipsAsReciever = new ArrayList<>();

    public String generateEncodedNickname(String nickNamePrefix) { //  mailden nickname oluşturur

        int atIndex = this.username.indexOf('@');
        String usernamePrefix = atIndex != -1 ? username.substring(0, atIndex) : username;

        StringBuilder numericUsernamePrefix = new StringBuilder();
        for (char c : usernamePrefix.toCharArray()) {
            numericUsernamePrefix.append((int) c);
        }

        Random ran = new Random();
        int randomNum = ran.nextInt(1000);

        String encodedNickname = nickNamePrefix + numericUsernamePrefix.toString() + randomNum;

        return encodedNickname;
    }



    public List<GetFriendRequestDto> getFriendRequests() { // Kullanıcıya gelen arkadaşlık isteklerini döndürür.
        List<GetFriendRequestDto> fRequests = new ArrayList<>();

        for (Friendship friendship : friendshipsAsReciever) {
            if (friendship.getStatus().equals(FriendshiptStatus.PENDING)) {
                UserEntity sender = friendship.getSenderEntity();
                GetFriendRequestDto dto = new GetFriendRequestDto(friendship.getId(), sender.getProfileImg(),
                        sender.getNickname(), friendship.getDate());
                fRequests.add(dto);
            }

        }
        return fRequests;

    }
}
