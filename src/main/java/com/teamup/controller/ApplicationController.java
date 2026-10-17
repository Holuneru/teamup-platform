package com.teamup.controller;

import com.teamup.dto.response.ApplicationResponse;
import com.teamup.service.ProjectApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ProjectApplicationService projectApplicationService;

    @PostMapping("/{id}/accept")
    public ApplicationResponse accept(@PathVariable Long id) {
        return projectApplicationService.accept(id);
    }

    @PostMapping("/{id}/reject")
    public ApplicationResponse reject(@PathVariable Long id) {
        return projectApplicationService.reject(id);
    }

    @PutMapping("/{id}")
    public ApplicationResponse updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        if ("APPROVED".equalsIgnoreCase(status) || "ACCEPTED".equalsIgnoreCase(status)) {
            return projectApplicationService.accept(id);
        }
        return projectApplicationService.reject(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectApplicationService.delete(id);
    }
}
