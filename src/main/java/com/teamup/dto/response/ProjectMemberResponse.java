package com.teamup.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectMemberResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String avatarUrl;

    private String role;
}