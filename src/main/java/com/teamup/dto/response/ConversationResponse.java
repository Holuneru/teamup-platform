package com.teamup.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ConversationResponse {
    private Long id;
    private UserShortResponse peer;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
}