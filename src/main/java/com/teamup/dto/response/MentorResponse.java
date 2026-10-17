package com.teamup.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@Builder
public class MentorResponse {

    private Long id;

    private String name;

    private String organization;

    private String description;

    private String telegram;

    private String email;

    private Set<SkillResponse> skills;
}
