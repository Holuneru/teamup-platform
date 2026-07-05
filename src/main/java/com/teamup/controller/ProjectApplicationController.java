package com.teamup.controller;

import com.teamup.dto.request.CreateApplicationRequest;
import com.teamup.dto.response.ApplicationResponse;
import com.teamup.entity.ProjectMember;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.service.ProjectApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectApplicationController {

    private final ProjectApplicationService service;
    private final ProjectMemberRepository projectMemberRepository;

    @PostMapping("/{projectId}/apply")
    public ApplicationResponse apply(
            @PathVariable Long projectId,
            @RequestBody CreateApplicationRequest request
    ) {
        return service.apply(projectId, request);
    }

    @GetMapping("/{projectId}/members")
    public List<ProjectMember> getMembers(@PathVariable Long projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }

    @GetMapping("/{projectId}/applications")
    public List<ApplicationResponse> getApplications(@PathVariable Long projectId) {
        return service.getByProject(projectId);
    }

    @PostMapping("/applications/{id}/accept")
    public ApplicationResponse accept(@PathVariable Long id) {
        return service.accept(id);
    }

    @PostMapping("/applications/{id}/reject")
    public ApplicationResponse reject(@PathVariable Long id) {
        return service.reject(id);
    }
}