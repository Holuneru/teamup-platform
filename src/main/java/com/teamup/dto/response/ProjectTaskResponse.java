package com.teamup.dto.response;

import com.teamup.enums.ProjectTaskPriority;
import com.teamup.enums.ProjectTaskStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ProjectTaskResponse {
    private Long id;
    private Long projectId;
    private Long createdById;
    private UserShortResponse assignee;
    private String title;
    private String description;
    private ProjectTaskStatus status;
    private ProjectTaskPriority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
}