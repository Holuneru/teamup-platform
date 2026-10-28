package com.teamup.repository;

import com.teamup.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByParticipantOneIdAndParticipantTwoId(Long participantOneId, Long participantTwoId);

    List<Conversation> findByParticipantOneIdOrParticipantTwoIdOrderByLastMessageAtDesc(Long participantOneId, Long participantTwoId);
}