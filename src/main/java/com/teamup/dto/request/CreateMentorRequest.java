package com.teamup.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class CreateMentorRequest {

    @NotBlank
    private String name;

    private String organization;

    private String description;

    private String telegram;

    @Email
    private String email;

    private Set<Long> skillIds;
}
