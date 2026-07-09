package com.teamup.entity;

import com.teamup.enums.InvitationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_invitations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status;

    @Column(nullable =false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();

        if (status == null) {
            status = InvitationStatus.PENDING;
        }

    }

}