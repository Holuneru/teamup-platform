package com.teamup.dto.request;

import lombok.*;

import java.util.Set;

@Getter
@Setter
public class CreateProjectRequest {

    private String title;
    private String description;
    private Long ownerId;
    private Set<Long> requiredSkillIds;
}