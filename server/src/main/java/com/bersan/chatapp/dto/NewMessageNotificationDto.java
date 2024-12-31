package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NewMessageNotificationDto {
    private String room;
    private String content;

}
