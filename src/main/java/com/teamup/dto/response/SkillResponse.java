package com.teamup.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillResponse {

    private Long id;

    private String name;

}