package com.bersan.chatapp.dto;

import com.bersan.chatapp.model.FriendshiptStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchUserResponseDto {
    private int userId;
    private String profileImg;
    private String nickname;
    private FriendshiptStatus status;
    private Integer requestId;

    public SearchUserResponseDto(int userId, String profileImg, String nickname) {
        this.userId = userId;
        this.profileImg = profileImg;
        this.nickname = nickname;
    }

}
