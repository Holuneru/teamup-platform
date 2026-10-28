package com.teamup.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatMessageResponse {
    private Long id;
    private Long senderId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}