package com.teamup.controller;

import com.teamup.dto.request.CreateApplicationRequest;
import com.teamup.dto.response.ApplicationResponse;
import com.teamup.service.ProjectApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectApplicationController {

    private final ProjectApplicationService service;

    @PostMapping("/{projectId}/apply")
    public ApplicationResponse apply(
            @PathVariable Long projectId,
            @RequestBody CreateApplicationRequest request
    ) {
        return service.apply(projectId, request);
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