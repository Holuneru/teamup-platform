package com.teamup.mapper;

import com.teamup.dto.response.ProjectResponse;
import com.teamup.entity.Project;
import com.teamup.entity.Skill;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
@Component
public class ProjectMapper {
    public ProjectResponse toResponse(Project project) {

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .ownerId(project.getOwner().getId())
                .requiredSkills(
                        project.getRequiredSkills()
                                .stream()
                                .map(Skill::getName)
                                .collect(Collectors.toSet())
                )
                .createdAt(project.getCreatedAt())
                .build();
    }
}
