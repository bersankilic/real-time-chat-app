package com.bersan.chatapp.dto;

import lombok.Data;

@Data
public class RegisterDto {
    private String username;
    private String password;
    private String confirmPassword;
    private String nickname;
    private String profileImg = "http://res.cloudinary.com/do9flnwgi/image/upload/v1702645974/chat_profiles/h36jgq8rmfusrrnc1dmn.jpg";
}
