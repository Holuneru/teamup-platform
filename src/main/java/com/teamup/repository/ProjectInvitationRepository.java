package com.teamup.repository;

import com.teamup.entity.ProjectInvitation;
import com.teamup.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Long> {

    List<ProjectInvitation> findByUserId(Long userId);

    List<ProjectInvitation> findByUserIdAndStatus(
            Long userId,
            InvitationStatus status
    );

    Optional<ProjectInvitation> findByProjectIdAndUserId(
            Long projectId,
            Long userId
    );

}