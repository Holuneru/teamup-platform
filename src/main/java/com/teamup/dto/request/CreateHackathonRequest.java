package com.teamup.dto.request;

import com.teamup.enums.HackathonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateHackathonRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private LocalDate deadline;

    private String location;

    @NotNull
    private HackathonFormat format;

    private String prize;

    private String link;
}
