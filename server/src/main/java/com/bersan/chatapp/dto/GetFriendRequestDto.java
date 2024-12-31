package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class GetFriendRequestDto {
    private int id;
    private String profileImg;
    private String nickname;
    @DateTimeFormat(pattern = "MM-dd-yyyy")
    private LocalDate date;
}
