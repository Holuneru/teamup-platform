package com.teamup.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
public class ProjectResponse {

    private Long id;
    private String title;
    private String description;
    private Long ownerId;
    private Set<String> requiredSkills;
    private LocalDateTime createdAt;
}