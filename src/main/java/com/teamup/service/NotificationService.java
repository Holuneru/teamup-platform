package com.teamup.service;

import com.teamup.dto.response.NotificationResponse;
import com.teamup.dto.response.UserShortResponse;
import com.teamup.entity.User;
import com.teamup.entity.UserNotification;
import com.teamup.enums.NotificationType;
import com.teamup.repository.UserNotificationRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final UserNotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void create(Long recipientId, Long actorId, NotificationType type, String title, String body, String targetUrl) {
        if (recipientId.equals(actorId)) {
            return;
        }
        notificationRepository.save(UserNotification.builder()
                .recipientId(recipientId)
                .actorId(actorId)
                .type(type)
                .title(title)
                .body(body)
                .targetUrl(targetUrl)
                .build());
    }

    public List<NotificationResponse> getMine() {
        Long userId = currentUserId();
        return notificationRepository.findTop100ByRecipientIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public long getUnreadCount() {
        return notificationRepository.countByRecipientIdAndReadAtIsNull(currentUserId());
    }

    @Transactional
    public void markRead(Long id) {
        notificationRepository.markRead(id, currentUserId());
    }

    @Transactional
    public void markAllRead() {
        notificationRepository.markAllRead(currentUserId());
    }

    private NotificationResponse toResponse(UserNotification notification) {
        UserShortResponse actor = null;
        if (notification.getActorId() != null) {
            actor = userRepository.findById(notification.getActorId())
                    .map(user -> UserShortResponse.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .avatarUrl(user.getAvatarUrl())
                            .build())
                    .orElse(null);
        }
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .body(notification.getBody())
                .targetUrl(notification.getTargetUrl())
                .actor(actor)
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}