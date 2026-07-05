package com.teamup.service;

import com.teamup.dto.request.CreateProjectRequest;
import com.teamup.dto.response.ProjectResponse;
import com.teamup.entity.Project;
import com.teamup.entity.Skill;
import com.teamup.entity.User;
import com.teamup.exception.UserNotFoundException;
import com.teamup.mapper.ProjectMapper;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.SkillRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectMapper projectMapper;

    public ProjectResponse createProject(CreateProjectRequest request) {

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new UserNotFoundException(request.getOwnerId()));

        Set<Skill> skills = new HashSet<>(
                skillRepository.findAllById(request.getRequiredSkillIds())
        );

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(owner)
                .requiredSkills(skills)
                .members(new HashSet<>()) // 🔥 ВАЖНО: фикс инициализации
                .build();

        Project saved = projectRepository.save(project);

        return projectMapper.toResponse(saved);
    }

    public List<ProjectResponse> getAllProjects() {

        List<Project> projects = projectRepository.findAllWithMembersAndSkills();

        return projects.stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    public List<ProjectResponse> getByOwner(Long ownerId) {

        List<Project> projects = projectRepository.findByOwnerIdWithMembers(ownerId);

        return projects.stream()
                .map(projectMapper::toResponse)
                .toList();
    }
}