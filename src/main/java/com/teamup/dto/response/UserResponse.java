package com.teamup.dto.response;

import com.teamup.enums.ParticipationFormat;
import com.teamup.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String university;

    private Integer course;

    private String about;

    private String telegram;

    private String github;

    private String avatarUrl;

    private ParticipationFormat participationFormat;

    private Role role;

    private Set<SkillResponse> skills;
}