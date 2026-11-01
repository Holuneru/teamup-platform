package com.teamup.service;

import com.teamup.dto.request.CreateProjectTaskRequest;
import com.teamup.dto.request.CreateTaskCommentRequest;
import com.teamup.dto.request.UpdateProjectTaskRequest;
import com.teamup.dto.request.UpdateProjectTaskStatusRequest;
import com.teamup.dto.response.ProjectTaskResponse;
import com.teamup.dto.response.TaskCommentResponse;
import com.teamup.dto.response.UserShortResponse;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectMember;
import com.teamup.entity.ProjectTask;
import com.teamup.entity.TaskComment;
import com.teamup.entity.User;
import com.teamup.enums.ProjectTaskPriority;
import com.teamup.enums.ProjectTaskStatus;
import com.teamup.exception.ForbiddenException;
import com.teamup.exception.ResourceNotFoundException;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.ProjectTaskRepository;
import com.teamup.repository.TaskCommentRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectTaskService {

    private final ProjectTaskRepository taskRepository;
    private final TaskCommentRepository commentRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ProjectTaskResponse> getTasks(Long projectId) {
        Project project = getAccessibleProject(projectId);
        Set<Long> activeMemberIds = getActiveMemberIds(projectId, project.getOwner().getId());
        return taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(task -> toResponse(task, activeMemberIds))
                .toList();
    }

    @Transactional
    public ProjectTaskResponse createTask(Long projectId, CreateProjectTaskRequest request) {
        Project project = getAccessibleProject(projectId);
        Long currentUserId = currentUserId();
        Long assigneeId = request.getAssigneeId();
        Set<Long> activeMemberIds = getActiveMemberIds(projectId, project.getOwner().getId());

        if (assigneeId != null && !activeMemberIds.contains(assigneeId)) {
            throw new ForbiddenException("Назначить задачу можно только участнику проекта");
        }

        ProjectTask task = taskRepository.save(ProjectTask.builder()
                .projectId(projectId)
                .createdById(currentUserId)
                .assigneeId(assigneeId)
                .title(request.getTitle().trim())
                .description(request.getDescription() == null ? null : request.getDescription().trim())
                .status(ProjectTaskStatus.TODO)
                .priority(request.getPriority() == null ? ProjectTaskPriority.MEDIUM : request.getPriority())
                .dueDate(request.getDueDate())
                .build());

        return toResponse(task, activeMemberIds);
    }

    @Transactional
    public ProjectTaskResponse updateStatus(
            Long projectId,
            Long taskId,
            UpdateProjectTaskStatusRequest request
    ) {
        Project project = getAccessibleProject(projectId);
        ProjectTask task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Задача не найдена"));
        task.setStatus(request.getStatus());
        return toResponse(taskRepository.save(task), getActiveMemberIds(projectId, project.getOwner().getId()));
    }

    @Transactional
    public ProjectTaskResponse updateTask(Long projectId, Long taskId, UpdateProjectTaskRequest request) {
        Project project = getAccessibleProject(projectId);
        ProjectTask task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Задача не найдена"));

        Long assigneeId = request.getAssigneeId();
        Set<Long> activeMemberIds = getActiveMemberIds(projectId, project.getOwner().getId());
        if (assigneeId != null && !activeMemberIds.contains(assigneeId)) {
            throw new ForbiddenException("Назначить задачу можно только участнику проекта");
        }

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription() == null ? null : request.getDescription().trim());
        task.setAssigneeId(assigneeId);
        task.setPriority(request.getPriority() == null ? task.getPriority() : request.getPriority());
        task.setDueDate(request.getDueDate());

        return toResponse(taskRepository.save(task), activeMemberIds);
    }

    @Transactional(readOnly = true)
    public List<TaskCommentResponse> getComments(Long projectId, Long taskId) {
        getAccessibleProject(projectId);
        taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Задача не найдена"));

        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
                .stream()
                .map(this::toCommentResponse)
                .toList();
    }

    @Transactional
    public TaskCommentResponse addComment(Long projectId, Long taskId, CreateTaskCommentRequest request) {
        getAccessibleProject(projectId);
        ProjectTask task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Задача не найдена"));
        Long authorId = currentUserId();

        TaskComment comment = commentRepository.save(TaskComment.builder()
                .projectId(projectId)
                .taskId(task.getId())
                .authorId(authorId)
                .content(request.getContent().trim())
                .build());

        return toCommentResponse(comment);
    }

    @Transactional
    public void deleteTask(Long projectId, Long taskId) {
        getAccessibleProject(projectId);
        ProjectTask task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Задача не найдена"));
        Long userId = currentUserId();
        Project project = projectRepository.findByIdWithOwner(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));
        boolean isOwner = project.getOwner().getId().equals(userId);
        if (!isOwner && !task.getCreatedById().equals(userId)) {
            throw new ForbiddenException("Удалить задачу может ее автор или владелец проекта");
        }
        taskRepository.delete(task);
    }

    private Project getAccessibleProject(Long projectId) {
        Project project = projectRepository.findByIdWithOwner(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));
        Long userId = currentUserId();
        boolean isOwner = project.getOwner().getId().equals(userId);
        boolean isMember = memberRepository.existsByProjectIdAndUserId(projectId, userId);
        if (!isOwner && !isMember) {
            throw new ForbiddenException("Доска доступна только владельцу и участникам проекта");
        }
        return project;
    }

    private Set<Long> getActiveMemberIds(Long projectId, Long ownerId) {
        Set<Long> ids = new HashSet<>();
        ids.add(ownerId);
        for (ProjectMember member : memberRepository.findByProjectId(projectId)) {
            ids.add(member.getUserId());
        }
        return ids;
    }

    private ProjectTaskResponse toResponse(ProjectTask task, Set<Long> activeMemberIds) {
        UserShortResponse assignee = null;
        if (task.getAssigneeId() != null) {
            User user = userRepository.findById(task.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Исполнитель не найден"));
            assignee = UserShortResponse.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .avatarUrl(user.getAvatarUrl())
                    .build();
        }
        return ProjectTaskResponse.builder()
                .id(task.getId())
                .projectId(task.getProjectId())
                .createdById(task.getCreatedById())
                .assignee(assignee)
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .build();
    }

    private TaskCommentResponse toCommentResponse(TaskComment comment) {
        User author = userRepository.findById(comment.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Автор комментария не найден"));
        return TaskCommentResponse.builder()
                .id(comment.getId())
                .projectId(comment.getProjectId())
                .taskId(comment.getTaskId())
                .authorId(comment.getAuthorId())
                .author(UserShortResponse.builder()
                        .id(author.getId())
                        .firstName(author.getFirstName())
                        .lastName(author.getLastName())
                        .avatarUrl(author.getAvatarUrl())
                        .build())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}