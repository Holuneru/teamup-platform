package com.teamup.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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

    // 🔥 Новый объект владельца
    private UserShortResponse owner;

    private Set<String> requiredSkills;

    private LocalDateTime createdAt;


}