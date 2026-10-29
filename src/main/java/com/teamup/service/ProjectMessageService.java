package com.teamup.service;

import com.teamup.dto.request.SendProjectMessageRequest;
import com.teamup.dto.response.ProjectMessageResponse;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectMember;
import com.teamup.entity.ProjectMessage;
import com.teamup.entity.User;
import com.teamup.exception.ForbiddenException;
import com.teamup.exception.ResourceNotFoundException;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectMessageRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectMessageService {

    private final ProjectMessageRepository messageRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ProjectMessageResponse> getMessages(Long projectId) {
        Project project = getAccessibleProject(projectId);
        Set<Long> activeMemberIds = getActiveMemberIds(projectId, project.getOwner().getId());

        return messageRepository.findTop100ByProjectIdOrderByIdDesc(projectId)
                .stream()
                .sorted(Comparator.comparing(ProjectMessage::getId))
                .map(message -> toResponse(message, activeMemberIds))
                .toList();
    }

    @Transactional
    public ProjectMessageResponse sendMessage(Long projectId, SendProjectMessageRequest request) {
        Project project = getAccessibleProject(projectId);
        Long senderId = currentUserId();
        ProjectMessage message = messageRepository.save(ProjectMessage.builder()
                .projectId(projectId)
                .senderId(senderId)
                .content(request.getContent().trim())
                .build());

        Set<Long> activeMemberIds = getActiveMemberIds(projectId, project.getOwner().getId());
        return toResponse(message, activeMemberIds);
    }

    private Project getAccessibleProject(Long projectId) {
        Project project = projectRepository.findByIdWithOwner(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));
        Long userId = currentUserId();
        boolean isOwner = project.getOwner().getId().equals(userId);
        boolean isMember = memberRepository.existsByProjectIdAndUserId(projectId, userId);

        if (!isOwner && !isMember) {
            throw new ForbiddenException("Чат доступен только владельцу и участникам проекта");
        }
        return project;
    }

    private Set<Long> getActiveMemberIds(Long projectId, Long ownerId) {
        Set<Long> activeMemberIds = new HashSet<>();
        activeMemberIds.add(ownerId);
        for (ProjectMember member : memberRepository.findByProjectId(projectId)) {
            activeMemberIds.add(member.getUserId());
        }
        return activeMemberIds;
    }

    private ProjectMessageResponse toResponse(ProjectMessage message, Set<Long> activeMemberIds) {
        User sender = userRepository.findById(message.getSenderId()).orElse(null);
        return ProjectMessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .senderFirstName(sender == null ? "Удаленный пользователь" : sender.getFirstName())
                .senderLastName(sender == null ? "" : sender.getLastName())
                .senderAvatarUrl(sender == null ? null : sender.getAvatarUrl())
                .senderIsCurrentMember(activeMemberIds.contains(message.getSenderId()))
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }
}