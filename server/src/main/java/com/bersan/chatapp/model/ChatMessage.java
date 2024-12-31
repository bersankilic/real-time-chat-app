package com.bersan.chatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

// ChatMessage sınıfı  sohbet mesajını temsil eder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // birden fazla mesaj bir konuşma odasına ait olabilir
    @JoinColumn(name = "conversation_room_name")
    private Conversation conversation;

    private String sender;
    private String recipient;
    private String content;
    private String date;
    private String time;

    public ChatMessage(Conversation conversation, String sender, String recipient, String content, String date,
            String time) {
        this.conversation = conversation;
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.date = date;
        this.time = time;
    }
}
