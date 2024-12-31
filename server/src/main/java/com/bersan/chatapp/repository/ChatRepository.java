package com.bersan.chatapp.repository;

import com.bersan.chatapp.model.ChatMessage;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {

    @Transactional
    default Long saveAndReturnId(ChatMessage chatMessage) {
        ChatMessage savedMessage = save(chatMessage);
        return savedMessage.getId();
    }

}
