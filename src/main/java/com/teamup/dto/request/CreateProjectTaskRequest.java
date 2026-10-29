package com.teamup.dto.request;

import com.teamup.enums.ProjectTaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateProjectTaskRequest {

    @NotBlank
    @Size(max = 140)
    private String title;

    @Size(max = 2000)
    private String description;

    private Long assigneeId;
    private ProjectTaskPriority priority;
    private LocalDate dueDate;
}