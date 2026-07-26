package com.teamup.controller;

import com.teamup.dto.request.CreateApplicationRequest;
import com.teamup.dto.response.ApplicationResponse;
import com.teamup.dto.response.ProjectMemberResponse;
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


    @PostMapping("/{projectId}/apply")
    public ApplicationResponse apply(
            @PathVariable Long projectId,
            @RequestBody CreateApplicationRequest request
    ) {
        return service.apply(projectId, request);
    }

    //APPLICATIONS
    @GetMapping("/{projectId}/applications")
    public List<ApplicationResponse> getApplications(
            @PathVariable Long projectId
    ) {
        return service.getByProject(projectId);
    }

    //ACCEPT
    @PostMapping("/applications/{id}/accept")
    public ApplicationResponse accept(@PathVariable Long id) {
        return service.accept(id);
    }

    //REJECT
    @PostMapping("/applications/{id}/reject")
    public ApplicationResponse reject(@PathVariable Long id) {
        return service.reject(id);
    }

    //MEMBERS
    @GetMapping("/{projectId}/members")
    public List<ProjectMemberResponse> getMembers(
            @PathVariable Long projectId
    ) {
        return service.getMembers(projectId);
    }
}