package com.teamup.service;

import com.teamup.dto.request.CreateApplicationRequest;
import com.teamup.dto.response.ApplicationResponse;
import com.teamup.dto.response.ProjectMemberResponse;
import com.teamup.dto.response.UserShortResponse;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectApplication;
import com.teamup.entity.User;
import com.teamup.enums.ApplicationStatus;
import com.teamup.repository.ProjectApplicationRepository;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.exception.ResourceNotFoundException;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProjectApplicationService {

    private final ProjectApplicationRepository repository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ProjectMemberService memberService;
    private final ProjectRepository projectRepository;

    // ===========================
    // APPLY
    // ===========================

    public ApplicationResponse apply(Long projectId, CreateApplicationRequest request) {

        Long userId = currentUserId();

        Project project = projectRepository.findByIdWithOwner(projectId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Проект не найден")
                );


        if (Objects.equals(project.getOwner().getId(), userId)){
            throw new RuntimeException("Владелец не может откликнуться на свой проект");
        }

                if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
                        throw new RuntimeException("Вы уже являетесь участником проекта");
                }

                repository.findTopByProjectIdAndUserIdOrderByCreatedAtDesc(projectId, userId)
                                .filter(app -> app.getStatus() != ApplicationStatus.REMOVED)
                                .ifPresent(app -> {
                                        throw new RuntimeException("Вы уже отправляли заявку на этот проект");
                                });



        ProjectApplication app = ProjectApplication.builder()
                .projectId(projectId)
                .userId(userId)
                .status(ApplicationStatus.PENDING)
                .build();

        repository.save(app);

        return toResponse(app);
    }

    // ===========================
    // GET APPLICATIONS
    // ===========================

    public List<ApplicationResponse> getByProject(Long projectId) {

                ensureProjectOwner(projectId);

        return repository.findByProjectIdAndStatus(
                        projectId,
                        ApplicationStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ===========================
    // ACCEPT
    // ===========================

    public ApplicationResponse accept(Long id) {

        ProjectApplication app = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена"));

        ensureProjectOwner(app.getProjectId());

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("Заявка уже обработана");
        }

        app.setStatus(ApplicationStatus.ACCEPTED);

        repository.save(app);

        memberService.addMember(
                app.getProjectId(),
                app.getUserId()
        );

        return toResponse(app);
    }

    // ===========================
    // REJECT
    // ===========================

    public ApplicationResponse reject(Long id) {

        ProjectApplication app = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена"));

        ensureProjectOwner(app.getProjectId());

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("Заявка уже обработана");
        }

        app.setStatus(ApplicationStatus.REJECTED);

        repository.save(app);

        memberService.removeMember(
                app.getProjectId(),
                app.getUserId()
        );

        return toResponse(app);
    }

    // ===========================
    // MEMBERS
    // ===========================

    public List<ProjectMemberResponse> getMembers(Long projectId) {

        return projectMemberRepository.findByProjectId(projectId)
                .stream()
                .map(member -> {

                    User user = userRepository.findById(member.getUserId())
                            .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

                    return ProjectMemberResponse.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .avatarUrl(user.getAvatarUrl())
                            .role(member.getRole())
                            .build();

                })
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        ProjectApplication app = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена"));

                Long userId = currentUserId();
                if (!app.getUserId().equals(userId)) {
                        ensureProjectOwner(app.getProjectId());
                }

        repository.delete(app);
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

        private void ensureProjectOwner(Long projectId) {
                Project project = projectRepository.findByIdWithOwner(projectId)
                                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));
                if (!project.getOwner().getId().equals(currentUserId())) {
                        throw new org.springframework.security.access.AccessDeniedException(
                                        "Только владелец проекта может управлять заявками"
                        );
                }
        }

    // ===========================
    // MAPPER
    // ===========================

    private ApplicationResponse toResponse(ProjectApplication app) {

        User user = userRepository.findById(app.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        return ApplicationResponse.builder()
                .id(app.getId())
                .projectId(app.getProjectId())
                .applicant(
                        UserShortResponse.builder()
                                .id(user.getId())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .avatarUrl(user.getAvatarUrl())
                                .build()
                )
                .status(app.getStatus())
                .createdAt(app.getCreatedAt())
                .build();
    }

}