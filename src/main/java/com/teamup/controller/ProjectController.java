package com.teamup.controller;

import com.teamup.dto.request.CreateProjectRequest;
import com.teamup.dto.response.ProjectResponse;
import com.teamup.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody CreateProjectRequest request) {
        return projectService.createProject(request);
    }

    @GetMapping
    public List<ProjectResponse> getAll(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String skill
    ) {
        return projectService.getAllProjects(query, skill);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request
    ) {
        return projectService.updateProject(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @GetMapping("/my/{userId}")
    public List<ProjectResponse> getMyProjects(@PathVariable Long userId) {
        return projectService.getByOwner(userId);
    }

    @GetMapping("/my")
    public List<ProjectResponse> getMyProjects() {
        return projectService.getMyProjects();
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable Long id) {
        return projectService.getById(id);
    }

    @GetMapping("/{id}/workspace")
    public ProjectResponse getWorkspaceProject(@PathVariable Long id) {
        return projectService.getWorkspaceProject(id);
    }

    @GetMapping("/participating")
    public List<ProjectResponse> getMyParticipatingProjects() {

        return projectService.getMyParticipations();

    }

    @DeleteMapping("/{id}/leave")
    public void leaveProject(
            @PathVariable Long id
    ) {

        projectService.leaveProject(id);

    }

    @DeleteMapping("/{id}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable Long id,
            @PathVariable Long userId
    ) {
        projectService.removeMember(id, userId);
    }
}