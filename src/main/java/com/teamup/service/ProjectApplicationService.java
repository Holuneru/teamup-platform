package com.teamup.service;

import com.teamup.dto.request.CreateApplicationRequest;
import com.teamup.dto.response.ApplicationResponse;
import com.teamup.dto.response.ProjectMemberResponse;
import com.teamup.dto.response.UserShortResponse;
import com.teamup.entity.ProjectApplication;
import com.teamup.entity.ProjectMember;
import com.teamup.entity.User;
import com.teamup.enums.ApplicationStatus;
import com.teamup.repository.ProjectApplicationRepository;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectApplicationService {

    private final ProjectApplicationRepository repository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    // 📌 APPLY
    public ApplicationResponse apply(Long projectId, CreateApplicationRequest request) {

        repository.findByProjectIdAndUserId(projectId, request.getUserId())
                .ifPresent(app -> {
                    throw new RuntimeException("Already applied");
                });

        ProjectApplication app = ProjectApplication.builder()
                .projectId(projectId)
                .userId(request.getUserId())
                .status(ApplicationStatus.PENDING)
                .build();

        repository.save(app);

        return toResponse(app);
    }

    public List<ApplicationResponse> getByProject(Long projectId) {

        return repository.findByProjectIdAndStatus(
                        projectId,
                        ApplicationStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 📌 ACCEPT
    public ApplicationResponse accept(Long id) {

        ProjectApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("Already processed");
        }

        app.setStatus(ApplicationStatus.ACCEPTED);

        repository.save(app);

        ProjectMember member = ProjectMember.builder()
                .projectId(app.getProjectId())
                .userId(app.getUserId())
                .role("MEMBER")
                .build();

        projectMemberRepository.save(member);

        return toResponse(app);
    }

    // 📌 REJECT
    public ApplicationResponse reject(Long id) {

        ProjectApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("Already processed");
        }

        app.setStatus(ApplicationStatus.REJECTED);

        repository.save(app);

        projectMemberRepository
                .findByProjectIdAndUserId(app.getProjectId(), app.getUserId())
                .ifPresent(projectMemberRepository::delete);

        return toResponse(app);
    }

    // 📌 MEMBERS
    public List<ProjectMemberResponse> getMembers(Long projectId) {

        return projectMemberRepository.findByProjectId(projectId)
                .stream()
                .map(member -> {

                    User user = userRepository.findById(member.getUserId())
                            .orElseThrow(() -> new RuntimeException("User not found"));

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

    // 📌 mapper
    private ApplicationResponse toResponse(ProjectApplication app) {

        User user = userRepository.findById(app.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

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