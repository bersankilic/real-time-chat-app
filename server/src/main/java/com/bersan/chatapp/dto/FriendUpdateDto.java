package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FriendUpdateDto {
    private String nickname;
    private MessageType messageType;

    public enum MessageType {
        JOIN,
        LEAVE
    }
}
