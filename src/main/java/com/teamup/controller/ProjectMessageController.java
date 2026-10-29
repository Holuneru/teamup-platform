package com.teamup.controller;

import com.teamup.dto.request.SendProjectMessageRequest;
import com.teamup.dto.response.ProjectMessageResponse;
import com.teamup.service.ProjectMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/messages")
@RequiredArgsConstructor
public class ProjectMessageController {

    private final ProjectMessageService projectMessageService;

    @GetMapping
    public List<ProjectMessageResponse> getMessages(@PathVariable Long projectId) {
        return projectMessageService.getMessages(projectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectMessageResponse sendMessage(
            @PathVariable Long projectId,
            @Valid @RequestBody SendProjectMessageRequest request
    ) {
        return projectMessageService.sendMessage(projectId, request);
    }
}