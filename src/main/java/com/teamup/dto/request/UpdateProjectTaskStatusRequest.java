package com.teamup.dto.request;

import com.teamup.enums.ProjectTaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProjectTaskStatusRequest {

    @NotNull
    private ProjectTaskStatus status;
}