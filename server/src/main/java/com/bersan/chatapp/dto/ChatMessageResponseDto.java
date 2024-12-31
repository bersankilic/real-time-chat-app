package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponseDto {
    private Long id;
    private String sender;
    private String content;
    private String date;
    private String time;

}
