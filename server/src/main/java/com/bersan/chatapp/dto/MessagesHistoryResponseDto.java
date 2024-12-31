package com.bersan.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class MessagesHistoryResponseDto {
    private int totalPages;
    private int currentPage;
    private Map<String, List<ChatMessageResponseDto>> messagesByDate;
    private Boolean hasNext;
}
