package com.bersan.chatapp.repository;

import com.bersan.chatapp.dto.ChatMessageResponseDto;
import com.bersan.chatapp.model.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConversationRepository extends JpaRepository<Conversation, String> {

    // bir konuşmaya ait son 10 mesajı getirir
    @Query("SELECT NEW com.bersan.chatapp.dto.ChatMessageResponseDto(cm.id,cm.sender, cm.content, cm.date, cm.time) FROM ChatMessage cm WHERE cm.conversation.roomName = :roomName ORDER BY cm.id DESC")
    Page<ChatMessageResponseDto> findLastTenMessagesByConversationRoomName(@Param("roomName") String roomName,
            Pageable pageable);
}
