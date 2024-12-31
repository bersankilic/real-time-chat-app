package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UpdateProfileResponseDto {
    private String imagePath;
    private boolean firstLogin;

}
