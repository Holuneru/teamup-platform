package com.teamup.repository;

import com.teamup.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop100ByConversationIdOrderByCreatedAtDesc(Long conversationId);

    long countByConversationIdAndSenderIdNotAndReadAtIsNull(Long conversationId, Long userId);

    @Query("select count(m) from ChatMessage m join Conversation c on c.id = m.conversationId where (c.participantOneId = :userId or c.participantTwoId = :userId) and m.senderId <> :userId and m.readAt is null")
    long countUnreadForRecipient(@Param("userId") Long userId);

    @Modifying
    @Query("update ChatMessage m set m.readAt = CURRENT_TIMESTAMP where m.conversationId = :conversationId and m.senderId <> :userId and m.readAt is null")
    int markConversationRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}