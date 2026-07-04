package com.teamup.dto.request;

import lombok.Data;

import java.util.Set;

@Data
public class UpdateSkillsRequest {

    private Set<Long> skillIds;

}