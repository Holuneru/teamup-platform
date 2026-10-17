package com.teamup.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Set;

@Getter
@Setter
public class CreateProjectRequest {

    @NotBlank
    private String title;
    private String description;
    private Long ownerId;
    private Set<Long> requiredSkillIds;
}