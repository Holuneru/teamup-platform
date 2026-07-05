package com.teamup.mapper;

import com.teamup.dto.response.SkillResponse;
import com.teamup.entity.Skill;
import org.springframework.stereotype.Component;

@Component
public class SkillMapper {

    public SkillResponse toResponse(Skill skill) {

        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .build();
    }

}