package com.bersan.chatapp.model;

import com.bersan.chatapp.dto.FriendIsOnlineDto;
import com.bersan.chatapp.dto.GetFriendRequestDto;
import com.bersan.chatapp.dto.NewMessageNotificationDto;
import lombok.Data;

// Notification sınıfı bildirimlerin içeriğini temsil eder

@Data
public class Notification {
    private String message;
    private MessageType messageType;
    private FriendIsOnlineDto friend;
    private GetFriendRequestDto fRequest;
    private Integer requestId;
    private NewMessageNotificationDto info;

    public Notification(String message, MessageType messageType, FriendIsOnlineDto friend) {
        this.message = message;
        this.messageType = messageType;
        this.friend = friend;
    }

    public Notification(String message, MessageType messageType, NewMessageNotificationDto info) {
        this.message = message;
        this.messageType = messageType;
        this.info = info;
    }

    public Notification(String message, MessageType messageType, GetFriendRequestDto fRequest) {
        this.message = message;
        this.messageType = messageType;
        this.fRequest = fRequest;
    }

    public Notification(String message, MessageType messageType, Integer requestId) {
        this.message = message;
        this.messageType = messageType;
        this.requestId = requestId;
    }

}
