package com.teamup.service;

import com.teamup.dto.request.CreateApplicationRequest;
import com.teamup.dto.response.ApplicationResponse;
import com.teamup.entity.ProjectApplication;
import com.teamup.entity.ProjectMember;
import com.teamup.enums.ApplicationStatus;
import com.teamup.repository.ProjectApplicationRepository;
import com.teamup.repository.ProjectMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectApplicationService {

    private final ProjectApplicationRepository repository;
    private final ProjectMemberRepository projectMemberRepository;

    public ApplicationResponse apply(Long projectId, CreateApplicationRequest request) {

        repository.findByProjectIdAndUserId(projectId, request.getUserId())
                .ifPresent(app -> {
                    throw new RuntimeException("Already applied");
                });

        ProjectApplication app = ProjectApplication.builder()
                .userId(request.getUserId())
                .projectId(projectId)
                .status(ApplicationStatus.PENDING)
                .build();

        repository.save(app);

        return toResponse(app);
    }

    public List<ApplicationResponse> getByProject(Long projectId) {
        return repository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse accept(Long id) {

        ProjectApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        app.setStatus(ApplicationStatus.ACCEPTED);
        repository.save(app);


        if (!projectMemberRepository.existsByProjectIdAndUserId(
                app.getProjectId(),
                app.getUserId()
        )) {
            ProjectMember member = ProjectMember.builder()
                    .projectId(app.getProjectId())
                    .userId(app.getUserId())
                    .role("MEMBER")
                    .build();

            projectMemberRepository.save(member);
        }

        return toResponse(app);
    }

    public ApplicationResponse reject(Long id) {

        ProjectApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        app.setStatus(ApplicationStatus.REJECTED);
        repository.save(app);


        projectMemberRepository
                .findByProjectIdAndUserId(app.getProjectId(), app.getUserId())
                .ifPresent(projectMemberRepository::delete);

        return toResponse(app);
    }

    private ApplicationResponse toResponse(ProjectApplication app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .projectId(app.getProjectId())
                .userId(app.getUserId())
                .status(app.getStatus())
                .createdAt(app.getCreatedAt())
                .build();
    }
}