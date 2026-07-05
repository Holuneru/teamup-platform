package com.teamup.controller;

import com.teamup.dto.request.CreateProjectRequest;
import com.teamup.dto.response.ProjectResponse;
import com.teamup.entity.Project;
import com.teamup.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ProjectResponse create(@RequestBody CreateProjectRequest request) {
        return projectService.createProject(request);
    }
}