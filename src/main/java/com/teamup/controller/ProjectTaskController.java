package com.teamup.controller;

import com.teamup.dto.request.CreateProjectTaskRequest;
import com.teamup.dto.request.UpdateProjectTaskStatusRequest;
import com.teamup.dto.response.ProjectTaskResponse;
import com.teamup.service.ProjectTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class ProjectTaskController {

    private final ProjectTaskService taskService;

    @GetMapping
    public List<ProjectTaskResponse> getTasks(@PathVariable Long projectId) {
        return taskService.getTasks(projectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectTaskResponse createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateProjectTaskRequest request
    ) {
        return taskService.createTask(projectId, request);
    }

    @PatchMapping("/{taskId}/status")
    public ProjectTaskResponse updateStatus(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateProjectTaskStatusRequest request
    ) {
        return taskService.updateStatus(projectId, taskId, request);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        taskService.deleteTask(projectId, taskId);
    }
}