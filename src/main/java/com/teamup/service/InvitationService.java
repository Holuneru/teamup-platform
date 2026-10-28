package com.teamup.service;

import com.teamup.dto.response.InvitationResponse;
import com.teamup.dto.response.UserShortResponse;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectInvitation;
import com.teamup.entity.ProjectMember;
import com.teamup.entity.User;
import com.teamup.enums.InvitationStatus;
import com.teamup.enums.NotificationType;
import com.teamup.repository.ProjectInvitationRepository;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private final ProjectInvitationRepository invitationRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;
        private final NotificationService notificationService;

    // ==========================
    // Пригласить пользователя
    // ==========================

    public InvitationResponse invite(Long projectId, Long userId) {

                Long actorId = currentUserId();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

                if (!project.getOwner().getId().equals(actorId)) {
                        throw new org.springframework.security.access.AccessDeniedException("Только владелец проекта может приглашать участников");
                }

        // Нельзя пригласить владельца проекта
        if (project.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Owner cannot invite himself");
        }

        // Уже является участником проекта
        if (memberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new RuntimeException("User already member");
        }

        Optional<ProjectInvitation> existingInvitation =
                invitationRepository.findByProjectIdAndUserId(projectId, userId);

        if (existingInvitation.isPresent()) {

            ProjectInvitation invitation = existingInvitation.get();

            switch (invitation.getStatus()) {

                case PENDING ->
                        throw new RuntimeException("Invitation already exists");

                case ACCEPTED ->
                        throw new RuntimeException("User already accepted invitation");

                case REJECTED -> {

                    // Повторное приглашение
                    invitation.setStatus(InvitationStatus.PENDING);

                    invitationRepository.save(invitation);

                    notifyInvitation(userId, actorId, project);

                    return toResponse(invitation);
                }
            }
        }

        ProjectInvitation invitation = ProjectInvitation.builder()
                .projectId(projectId)
                .userId(userId)
                .status(InvitationStatus.PENDING)
                .build();

        invitationRepository.save(invitation);

        notifyInvitation(userId, actorId, project);

        return toResponse(invitation);
    }

    // ==========================
    // Получить мои приглашения
    // ==========================

    public List<InvitationResponse> getMyInvitations(Long userId) {

        return invitationRepository.findByUserIdAndStatus(
                        userId,
                        InvitationStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ==========================
    // Принять приглашение
    // ==========================

        @Transactional
        public InvitationResponse accept(Long invitationId) {

        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("Invitation already processed");
        }

                if (!invitation.getUserId().equals(currentUserId())) {
                        throw new org.springframework.security.access.AccessDeniedException("Это приглашение адресовано другому пользователю");
                }

        invitation.setStatus(InvitationStatus.ACCEPTED);

        invitationRepository.save(invitation);

        ProjectMember member = ProjectMember.builder()
                .projectId(invitation.getProjectId())
                .userId(invitation.getUserId())
                .role("MEMBER")
                .build();

        memberRepository.save(member);

        Project project = projectRepository.findById(invitation.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        notificationService.create(project.getOwner().getId(), invitation.getUserId(), NotificationType.INVITATION_ACCEPTED,
                "Приглашение принято", "Пользователь принял приглашение в проект «" + project.getTitle() + "»", "/projects/" + project.getId());

        return toResponse(invitation);
    }

    // ==========================
    // Отклонить приглашение
    // ==========================

        public InvitationResponse reject(Long invitationId) {

        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("Invitation already processed");
        }

                if (!invitation.getUserId().equals(currentUserId())) {
                        throw new org.springframework.security.access.AccessDeniedException("Это приглашение адресовано другому пользователю");
                }

        invitation.setStatus(InvitationStatus.REJECTED);

        invitationRepository.save(invitation);

        Project project = projectRepository.findById(invitation.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        notificationService.create(project.getOwner().getId(), invitation.getUserId(), NotificationType.INVITATION_REJECTED,
                "Приглашение отклонено", "Пользователь отклонил приглашение в проект «" + project.getTitle() + "»", "/projects/" + project.getId());

        return toResponse(invitation);
    }

    // ==========================
    // Mapper
    // ==========================

    private InvitationResponse toResponse(ProjectInvitation invitation) {

        Project project = projectRepository.findById(invitation.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User owner = userRepository.findById(project.getOwner().getId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return InvitationResponse.builder()
                .id(invitation.getId())
                .projectId(project.getId())
                .projectTitle(project.getTitle())
                .status(invitation.getStatus())
                .createdAt(invitation.getCreatedAt())
                .inviter(
                        UserShortResponse.builder()
                                .id(owner.getId())
                                .firstName(owner.getFirstName())
                                .lastName(owner.getLastName())
                                .avatarUrl(owner.getAvatarUrl())
                                .build()
                )
                .build();
    }

        private void notifyInvitation(Long recipientId, Long actorId, Project project) {
                User actor = userRepository.findById(actorId)
                                .orElseThrow(() -> new RuntimeException("Owner not found"));
                notificationService.create(recipientId, actorId, NotificationType.PROJECT_INVITATION,
                                "Приглашение в проект", actor.getFirstName() + " " + actor.getLastName()
                                                + " приглашает вас в проект «" + project.getTitle() + "»", "/invitations");
        }

        private Long currentUserId() {
                return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }

    public List<String> getInvitationStatuses(Long userId) {

        Long ownerId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        List<Project> projects =
                projectRepository.findByOwnerIdWithMembers(ownerId);

        return projects.stream()
                .map(project -> {

                    if (memberRepository.existsByProjectIdAndUserId(
                            project.getId(),
                            userId
                    )) {

                        return project.getId() + ":MEMBER";
                    }

                    Optional<ProjectInvitation> invitation =
                            invitationRepository.findByProjectIdAndUserId(
                                    project.getId(),
                                    userId
                            );

                    if (invitation.isPresent()) {

                        return project.getId() + ":" +
                                invitation.get().getStatus().name();

                    }

                    return project.getId() + ":NONE";

                })
                .toList();

    }
}