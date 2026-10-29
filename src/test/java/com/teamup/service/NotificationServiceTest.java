package com.teamup.service;

import com.teamup.enums.NotificationType;
import com.teamup.repository.UserNotificationRepository;
import com.teamup.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NotificationServiceTest {

    private static final Long USER_ID = 24L;

    private UserNotificationRepository notificationRepository;
    private NotificationService service;

    @BeforeEach
    void setUp() {
        notificationRepository = mock(UserNotificationRepository.class);
        service = new NotificationService(notificationRepository, mock(UserRepository.class));
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(USER_ID, "test", List.of())
        );
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void notificationFeedExcludesDirectMessageNotifications() {
        when(notificationRepository.findTop100ByRecipientIdAndTypeNotOrderByCreatedAtDesc(
                USER_ID,
                NotificationType.NEW_MESSAGE
        )).thenReturn(List.of());

        assertEquals(0, service.getMine().size());
        verify(notificationRepository).findTop100ByRecipientIdAndTypeNotOrderByCreatedAtDesc(
                USER_ID,
                NotificationType.NEW_MESSAGE
        );
    }

    @Test
    void unreadNotificationCountExcludesDirectMessages() {
        when(notificationRepository.countByRecipientIdAndReadAtIsNullAndTypeNot(
                USER_ID,
                NotificationType.NEW_MESSAGE
        )).thenReturn(2L);

        assertEquals(2L, service.getUnreadCount());
    }
}
