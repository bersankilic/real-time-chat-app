package com.bersan.chatapp.controller;

import com.bersan.chatapp.dto.ChatMessageDto;
import com.bersan.chatapp.dto.ChatMessageResponseDto;
import com.bersan.chatapp.dto.NewMessageNotificationDto;
import com.bersan.chatapp.model.Notification;
import com.bersan.chatapp.services.ChatService;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


@Controller
public class ChatController {

    private ChatService chatService;
    private final SimpMessagingTemplate simpMessagingTemplate; // Websocket mesajlarını göndermek için kullanılır

    public ChatController(ChatService chatService, SimpMessagingTemplate simpMessagingTemplate) {
        this.chatService = chatService;
        this.simpMessagingTemplate = simpMessagingTemplate;

    }
    
    // API üzerinden belirli bir oda için mesaj geçmişini sayfalayarak alır.
    @GetMapping("/api/messages/{roomName}")
    public ResponseEntity<?> getMessagesHistoryByPaginating(
            @RequestParam(value = "pageNumber", defaultValue = "0") int pageNumber,
            @PathVariable String roomName) {
        return chatService.getMessagesHistoryByPaginating(roomName, pageNumber);
    }
    
    // WebSocket oturumu BAĞLANDIĞINDA bu event dinleyicisi çalışır ve ilgili servise yönlendirilir.
    @EventListener
    public void handleSessionConnectEvent(SessionConnectEvent event) {
        try {

            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
            chatService.connectEvent(headerAccessor);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // WebSocket oturumu bağlantısı kesildiğinde bu event dinleyicisi çalışır ve bağlantı kesilme işlemi yapılır.
    @EventListener
    public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
        try {
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
            chatService.disconnectEvent(headerAccessor); // bağlantı kesildiğinde yapılacak işlemler
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    
    // WebSocket üzerinden gönderilen mesaj işlenir ve ilgili kullanıcılara bildirim gönderilir
    // Private mesaj gönderme işlemi.
    @MessageMapping("/private.{roomName}")
    public void sendPrivateMessage(@DestinationVariable String roomName, ChatMessageDto message) {
        try {
            Long messageId = chatService.saveMessage(message);
            NewMessageNotificationDto info = new NewMessageNotificationDto(roomName, message.getContent());
            
            // mesajın cevap olarak oluştur ve gönder
            ChatMessageResponseDto newMessage = new ChatMessageResponseDto(messageId, message.getSender(),
                    message.getContent(),
                    message.getDate(),
                    message.getTime());
            simpMessagingTemplate.convertAndSend("/topic/private." + roomName, newMessage);
            //  bildirim oluştur ve alıcıya gönder
            Notification notification = new Notification(
                    message.getSender() + " Sana bir mesaj gönderdi !",
                    com.bersan.chatapp.model.MessageType.NEW_MESSAGE, info);
            simpMessagingTemplate.convertAndSendToUser(message.getRecipient(), "/queue/notifications",
                    notification);
        } catch (Exception e) {
            System.out.println(e);
        }

    }

    // mesaj silme işlemi. Belirtilen mesaj ID'sine göre mesaj silinir.
    @MessageMapping("/delete.private.{roomName}")
    public void deletePrivateMessage(@DestinationVariable String roomName, String messageId) {
        try {
            Long messageIdToDelete = Long.valueOf(messageId);
            chatService.deleteChatMessageById(messageIdToDelete, roomName);

        } catch (Exception e) {
            System.out.println(e);
        }
    }

}
