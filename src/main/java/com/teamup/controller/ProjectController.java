package com.teamup.controller;

import com.teamup.dto.request.CreateProjectRequest;
import com.teamup.dto.response.ProjectResponse;
import com.teamup.entity.Project;
import com.teamup.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ProjectResponse create(@RequestBody CreateProjectRequest request) {
        return projectService.createProject(request);
    }
    @GetMapping
    public List<ProjectResponse> getAll() {
        return projectService.getAllProjects();
    }

    @GetMapping("/my/{userId}")
    public List<ProjectResponse> getMyProjects(@PathVariable Long userId) {
        return projectService.getByOwner(userId);
    }
}