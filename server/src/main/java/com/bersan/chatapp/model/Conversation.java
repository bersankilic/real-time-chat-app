package com.bersan.chatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
// Conversation sınıfı, bir sohbet odasını temsil eder.
public class Conversation {
    @Id
    private String roomName;

    @ManyToMany
    @JoinTable(name = "conversation_participants", joinColumns = @JoinColumn(name = "conversation_room_name"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<UserEntity> participants = new ArrayList<>();
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL) // Bir sohbet odasında birden fazla mesaj olabilir.
    private List<ChatMessage> messages = new ArrayList<>();

    public Conversation(String roomName) {
        this.roomName = roomName;

    }
}
