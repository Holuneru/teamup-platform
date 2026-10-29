package com.teamup.service;

import com.teamup.dto.request.CreateProjectRequest;
import com.teamup.dto.response.ProjectResponse;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectApplication;
import com.teamup.entity.ProjectInvitation;
import com.teamup.entity.Skill;
import com.teamup.entity.User;
import com.teamup.enums.ApplicationStatus;
import com.teamup.enums.InvitationStatus;
import com.teamup.exception.ForbiddenException;
import com.teamup.exception.ResourceNotFoundException;
import com.teamup.exception.UserNotFoundException;
import com.teamup.mapper.ProjectMapper;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.SkillRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.teamup.repository.ProjectApplicationRepository;
import com.teamup.repository.ProjectInvitationRepository;
import com.teamup.repository.ProjectMemberRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectInvitationRepository projectInvitationRepository;
    private final ProjectApplicationRepository projectApplicationRepository;

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectMapper projectMapper;

    public ProjectResponse createProject(CreateProjectRequest request) {

        Long ownerId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new UserNotFoundException(ownerId));

        Set<Skill> skills = resolveSkills(request.getRequiredSkillIds());

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(owner)
                .requiredSkills(skills)
                .members(new HashSet<>())
                .build();

        Project saved = projectRepository.save(project);

        return projectMapper.toResponse(saved);
    }

    public List<ProjectResponse> getAllProjects(String query, String skill) {

        return projectRepository.findAllWithMembersAndSkills().stream()
                .filter(project -> query == null || query.isBlank()
                        || project.getTitle().toLowerCase().contains(query.toLowerCase())
                        || (project.getDescription() != null
                        && project.getDescription().toLowerCase().contains(query.toLowerCase())))
                .filter(project -> skill == null || skill.isBlank()
                        || project.getRequiredSkills().stream()
                        .anyMatch(item -> item.getName().equalsIgnoreCase(skill)))
                .map(projectMapper::toResponse)
                .toList();
    }

    public ProjectResponse getById(Long id) {

        Project project = projectRepository.findByIdWithMembers(id)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));

        return projectMapper.toResponse(project);
    }

        public ProjectResponse getWorkspaceProject(Long projectId) {
                Project project = projectRepository.findByIdWithMembers(projectId)
                                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));

                Long currentUserId = (Long) SecurityContextHolder.getContext()
                                .getAuthentication()
                                .getPrincipal();
                boolean isOwner = project.getOwner().getId().equals(currentUserId);
                boolean isMember = projectMemberRepository.existsByProjectIdAndUserId(projectId, currentUserId);

                if (!isOwner && !isMember) {
                        throw new ForbiddenException("Рабочее пространство доступно только владельцу и участникам проекта");
                }

                return projectMapper.toResponse(project);
        }

    public ProjectResponse updateProject(Long id, CreateProjectRequest request) {
        Project project = projectRepository.findByIdWithMembers(id)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));

        assertOwner(project);

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setRequiredSkills(resolveSkills(request.getRequiredSkillIds()));

        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));

        assertOwner(project);

        projectApplicationRepository.deleteByProjectId(id);
        projectInvitationRepository.deleteByProjectId(id);
        projectMemberRepository.deleteByProjectId(id);
        projectRepository.delete(project);
    }

    public List<ProjectResponse> getByOwner(Long ownerId) {

        List<Project> projects = projectRepository.findByOwnerIdWithMembers(ownerId);

        return projects.stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    public List<ProjectResponse> getMyProjects() {

        Long ownerId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        List<Project> projects = projectRepository.findByOwnerIdWithMembers(ownerId);

        return projects.stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    public List<ProjectResponse> getMyParticipations() {

        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        List<Project> projects =
                projectRepository.findProjectsWhereUserIsMember(userId);

        return projects.stream()
                .map(projectMapper::toResponse)
                .toList();

    }
    @Transactional
    public void leaveProject(Long projectId) {

        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));

        if (project.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Владелец не может покинуть свой проект");
        }

        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new RuntimeException("Вы не являетесь участником этого проекта");
        }

        projectMemberRepository.deleteByProjectIdAndUserId(projectId, userId);

        projectInvitationRepository.deleteByProjectIdAndUserId(projectId, userId);

        projectApplicationRepository.deleteByProjectIdAndUserId(projectId, userId);

    }

        @Transactional
        public void removeMember(Long projectId, Long memberUserId) {
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));

                assertOwner(project);

                if (project.getOwner().getId().equals(memberUserId)) {
                        throw new ForbiddenException("Нельзя удалить владельца проекта");
                }

                if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, memberUserId)) {
                        throw new ResourceNotFoundException("Пользователь не является участником проекта");
                }

                projectMemberRepository.deleteByProjectIdAndUserId(projectId, memberUserId);

                projectApplicationRepository.findTopByProjectIdAndUserIdOrderByCreatedAtDesc(projectId, memberUserId)
                                .ifPresent(application -> {
                                        application.setStatus(ApplicationStatus.REMOVED);
                                        projectApplicationRepository.save(application);
                                });

                projectInvitationRepository.findByProjectIdAndUserId(projectId, memberUserId)
                                .ifPresent(invitation -> {
                                        invitation.setStatus(InvitationStatus.REJECTED);
                                        projectInvitationRepository.save(invitation);
                                });
        }

    private void assertOwner(Project project) {
        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (project.getOwner() == null || !project.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("Только владелец может изменять проект");
        }
    }

    private Set<Skill> resolveSkills(Set<Long> skillIds) {
        if (skillIds == null || skillIds.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(skillRepository.findAllById(skillIds));
    }
}