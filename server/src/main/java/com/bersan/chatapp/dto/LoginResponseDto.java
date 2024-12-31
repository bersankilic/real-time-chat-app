package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoginResponseDto {

    private String userNickname;
    private String imagePath;
    private boolean isFirstLogin;

}
