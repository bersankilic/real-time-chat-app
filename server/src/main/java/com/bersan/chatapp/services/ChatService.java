package com.bersan.chatapp.services;

import com.bersan.chatapp.dto.*;
import com.bersan.chatapp.dto.FriendUpdateDto.MessageType;
import com.bersan.chatapp.model.ChatMessage;
import com.bersan.chatapp.model.Conversation;
import com.bersan.chatapp.model.UserEntity;
import com.bersan.chatapp.repository.ChatRepository;
import com.bersan.chatapp.repository.ConversationRepository;
import com.bersan.chatapp.repository.FriendshipRepository;
import com.bersan.chatapp.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

// Bu sınıf sohbetle ilgili işlemleri gerçekleştirmek için kullanılır
@Service
public class ChatService {

    private ConversationRepository conversationRepository;
    private ChatRepository chatRepository;
    private UserRepository userRepository;
    private FriendshipRepository friendshipRepository;
    private SimpMessagingTemplate simpMessagingTemplate;

    public ChatService(ConversationRepository conversationRepository,
            ChatRepository chatRepository, UserRepository userRepository, FriendshipRepository friendshipRepository,
            SimpMessagingTemplate simpMessagingTemplate) {
        this.conversationRepository = conversationRepository;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    // Kullanıcının sohbete katılma olayını işler
    public void connectEvent(StompHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            Optional<UserEntity> user = userRepository
                    .findByUsername(username);
            if (user.isPresent()) {
                UserEntity opUser = user.get();
                userRepository.updateOnlineStatus(username, true);
                String nickname = opUser.getNickname();
                headerAccessor.setSessionId(nickname);

         
                Optional<List<FriendDto>> friendsOptional = friendshipRepository.getOnlineFriends(opUser.getId());

                friendsOptional.ifPresent(friends -> {
                    List<String> onlineFriendNames = friends.stream()
                            .map(FriendDto::getNickname)
                            .collect(Collectors.toList());

              
                    onlineFriendNames.forEach(name -> {
                        FriendUpdateDto messagePayload = new FriendUpdateDto(nickname,
                                MessageType.JOIN);

                        simpMessagingTemplate.convertAndSendToUser(name, "/queue/onlineFriends", messagePayload);
                    });

                });
            }
        } catch (

        Exception e) {
            e.printStackTrace();
        }
    }

    
    // Kullanıcıdan gelen mesajı kaydeder
    public Long saveMessage(ChatMessageDto chatMessageDto) {
        try {
            Optional<Conversation> optionalConversation = conversationRepository.findById(chatMessageDto.getRoom());

            if (optionalConversation.isPresent()) {
                Conversation conversation = optionalConversation.get();
                ChatMessage newChatMessage = new ChatMessage(conversation, chatMessageDto.getSender(),
                        chatMessageDto.getRecipient(), chatMessageDto.getContent(), chatMessageDto.getDate(),
                        chatMessageDto.getTime());
                return chatRepository.saveAndReturnId(newChatMessage);
            } else {
                Conversation newConversation = new Conversation(chatMessageDto.getRoom());
                conversationRepository.save(newConversation);
                ChatMessage newChatMessage = new ChatMessage(newConversation, chatMessageDto.getSender(),
                        chatMessageDto.getRecipient(), chatMessageDto.getContent(), chatMessageDto.getDate(),
                        chatMessageDto.getTime());
                return chatRepository.saveAndReturnId(newChatMessage);

            }
        } catch (Exception e) {
            System.out.println(e);

        }
        return null;

    }

    // sohbet odasındaki bir mesajı siler
    public void deleteChatMessageById(Long id, String roomName) {
        try {
            chatRepository.deleteById(id);
            simpMessagingTemplate.convertAndSend("/topic/delete.private." + roomName, id);
        } catch (Exception e) {
            System.out.println(e);
        }

    }

    
    // bir sohbet odasının mesaj geçmişini sayfalandırarak getir
    public ResponseEntity<?> getMessagesHistoryByPaginating(String roomName, int pageNumber) {
        try {
            int pageSize = 10;
            Pageable pageable = PageRequest.of(pageNumber, pageSize);
            Page<ChatMessageResponseDto> messagesPage = conversationRepository
                    .findLastTenMessagesByConversationRoomName(roomName, pageable);

            if (messagesPage.isEmpty()) {
                return new ResponseEntity<>("Mesaj geçmişi yok", HttpStatus.NOT_FOUND);
            } else {
                int totalPages = messagesPage.getTotalPages();
                int currentPage = messagesPage.getNumber();
                Boolean hasNext = messagesPage.hasNext();
                List<ChatMessageResponseDto> messages = messagesPage.getContent();
                Map<String, List<ChatMessageResponseDto>> messagesByDate = new LinkedHashMap<>();

     
                for (ChatMessageResponseDto message : messages) {
                    String date = message.getDate();
                    messagesByDate.computeIfAbsent(date, k -> new ArrayList<>()).add(message);
                }

                MessagesHistoryResponseDto messagesHistoryResponse = new MessagesHistoryResponseDto(totalPages,
                        currentPage, messagesByDate, hasNext);

                return new ResponseEntity<>(messagesHistoryResponse, HttpStatus.OK);

            }

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    //bir kullanıcının websocket bağlantısını kestiğinde gerçekleşecek olayları işler
    public void disconnectEvent(StompHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            Optional<UserEntity> user = userRepository
                    .findByUsername(username);
            if (user.isPresent()) {
                UserEntity opUser = user.get();
                userRepository.updateOnlineStatus(username, true);
                String nickname = opUser.getNickname();
                headerAccessor.setSessionId(nickname);

                Optional<List<FriendDto>> friendsOptional = friendshipRepository.getOnlineFriends(opUser.getId());

                friendsOptional.ifPresent(friends -> {
                    List<String> onlineFriendNames = friends.stream()
                            .map(FriendDto::getNickname)
                            .collect(Collectors.toList());


                    onlineFriendNames.forEach(name -> {
                        FriendUpdateDto messagePayload = new FriendUpdateDto(nickname,
                                MessageType.LEAVE);

                        simpMessagingTemplate.convertAndSendToUser(name, "/queue/onlineFriends", messagePayload);
                    });

                });
                userRepository.updateOnlineStatus(username, false);
                System.out.println("Bağlantı kesildi: " + username);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
