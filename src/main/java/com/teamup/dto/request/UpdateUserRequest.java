package com.teamup.dto.request;

import com.teamup.enums.ParticipationFormat;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateUserRequest {

    private String firstName;

    private String lastName;

    private String university;

    @Positive
    private Integer course;

    private String about;

    private String telegram;

    private String github;

    private Boolean lookingForTeam;

    private ParticipationFormat participationFormat;

}