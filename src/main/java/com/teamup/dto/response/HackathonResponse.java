package com.teamup.dto.response;

import com.teamup.enums.HackathonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class HackathonResponse {

    private Long id;

    private String title;

    private String description;

    private LocalDate deadline;

    private String location;

    private HackathonFormat format;

    private String prize;

    private String link;
}
