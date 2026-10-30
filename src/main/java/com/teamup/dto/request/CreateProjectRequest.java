package com.teamup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Getter
@Setter
public class CreateProjectRequest {

    @NotBlank
    @Size(max = 120, message = "Название проекта не должно превышать 120 символов")
    private String title;
    private String description;
    private Long ownerId;
    private Set<Long> requiredSkillIds;
}