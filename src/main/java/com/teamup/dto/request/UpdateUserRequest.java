package com.teamup.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {

    private String firstName;

    private String lastName;

    private String university;

    private Integer course;

    private String about;

    private String telegram;

    private String github;

    private Boolean lookingForTeam;

}