package com.teamup.dto.response;

import com.teamup.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponse {
    private Long id;
    private NotificationType type;
    private String title;
    private String body;
    private String targetUrl;
    private UserShortResponse actor;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}