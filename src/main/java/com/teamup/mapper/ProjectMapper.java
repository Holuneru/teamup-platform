package com.teamup.mapper;

import com.teamup.dto.response.ProjectResponse;
import com.teamup.dto.response.UserShortResponse;
import com.teamup.entity.Project;
import com.teamup.entity.Skill;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())

                // ✅ owner safe
                .ownerId(project.getOwner() != null
                        ? project.getOwner().getId()
                        : null)

                // ✅ skills safe
                .requiredSkills(
                        project.getRequiredSkills() == null
                                ? Set.of()
                                : project.getRequiredSkills()
                                  .stream()
                                  .map(Skill::getName)
                                  .collect(Collectors.toSet())
                )

                // ✅ members safe + DTO mapping
                .members(
                        project.getMembers() == null
                                ? Set.of()
                                : project.getMembers()
                                  .stream()
                                  .map(user -> UserShortResponse.builder()
                                               .id(user.getId())
                                               .firstName(user.getFirstName())
                                               .lastName(user.getLastName())
                                               .avatarUrl(user.getAvatarUrl())
                                               .build()
                                  )
                                  .collect(Collectors.toSet())
                )

                .createdAt(project.getCreatedAt())
                .build();
    }
}