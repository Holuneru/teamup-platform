package com.teamup.mapper;

import com.teamup.dto.response.MentorResponse;
import com.teamup.entity.Mentor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MentorMapper {

    private final SkillMapper skillMapper;

    public MentorResponse toResponse(Mentor mentor) {
        return MentorResponse.builder()
                .id(mentor.getId())
                .name(mentor.getName())
                .organization(mentor.getOrganization())
                .description(mentor.getDescription())
                .telegram(mentor.getTelegram())
                .email(mentor.getEmail())
                .skills(
                        mentor.getSkills() == null
                                ? Set.of()
                                : mentor.getSkills().stream()
                                .map(skillMapper::toResponse)
                                .collect(Collectors.toSet())
                )
                .build();
    }
}
