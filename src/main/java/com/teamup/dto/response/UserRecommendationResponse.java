package com.teamup.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRecommendationResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String university;

    private String avatarUrl;

    private Integer matchPercent;

    private Set<String> matchedSkills;

}