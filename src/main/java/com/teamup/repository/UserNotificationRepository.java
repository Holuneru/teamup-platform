package com.teamup.repository;

import com.teamup.entity.UserNotification;
import com.teamup.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    List<UserNotification> findTop100ByRecipientIdOrderByCreatedAtDesc(Long recipientId);

        List<UserNotification> findTop100ByRecipientIdAndTypeNotOrderByCreatedAtDesc(
            Long recipientId,
            NotificationType type
        );

    long countByRecipientIdAndReadAtIsNull(Long recipientId);

        long countByRecipientIdAndReadAtIsNullAndTypeNot(Long recipientId, NotificationType type);

    @Modifying
    @Query("update UserNotification n set n.readAt = CURRENT_TIMESTAMP where n.id = :id and n.recipientId = :recipientId and n.readAt is null")
    int markRead(@Param("id") Long id, @Param("recipientId") Long recipientId);

    @Modifying
    @Query("update UserNotification n set n.readAt = CURRENT_TIMESTAMP where n.recipientId = :recipientId and n.readAt is null")
    int markAllRead(@Param("recipientId") Long recipientId);
}