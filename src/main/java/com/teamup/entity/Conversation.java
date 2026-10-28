package com.teamup.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversations", uniqueConstraints = @UniqueConstraint(
        columnNames = {"participant_one_id", "participant_two_id"}
))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participant_one_id", nullable = false)
    private Long participantOneId;

    @Column(name = "participant_two_id", nullable = false)
    private Long participantTwoId;

    @Column(nullable = false)
    private LocalDateTime lastMessageAt;

    @Column(name = "participant_one_deleted_at")
    private LocalDateTime participantOneDeletedAt;

    @Column(name = "participant_two_deleted_at")
    private LocalDateTime participantTwoDeletedAt;

    @PrePersist
    public void prePersist() {
        if (lastMessageAt == null) {
            lastMessageAt = LocalDateTime.now();
        }
    }
}