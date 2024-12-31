package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendIsOnlineDto {
    private String profileImg;
    private String nickname;
    private Boolean isOnline;

}
