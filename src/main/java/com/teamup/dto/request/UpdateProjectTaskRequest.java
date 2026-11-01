package com.teamup.dto.request;

import com.teamup.enums.ProjectTaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateProjectTaskRequest {

    @NotBlank(message = "Название задачи не может быть пустым")
    @Size(max = 140, message = "Название задачи должно быть до 140 символов")
    private String title;

    @Size(max = 2000, message = "Описание задачи должно быть до 2000 символов")
    private String description;

    private Long assigneeId;
    private ProjectTaskPriority priority;
    private LocalDate dueDate;
}
