package com.teamup.service;

import com.teamup.dto.request.CreateProjectTaskRequest;
import com.teamup.dto.request.UpdateProjectTaskStatusRequest;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectMember;
import com.teamup.entity.ProjectTask;
import com.teamup.entity.User;
import com.teamup.enums.ProjectTaskStatus;
import com.teamup.exception.ForbiddenException;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.ProjectTaskRepository;
import com.teamup.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectTaskServiceTest {

    private static final Long OWNER_ID = 1L;
    private static final Long MEMBER_ID = 2L;
    private static final Long PROJECT_ID = 10L;
    private static final Long TASK_ID = 40L;

    @Mock
    private ProjectTaskRepository taskRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectMemberRepository memberRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectTaskService service;

    @BeforeEach
    void setUp() {
        authenticateAs(MEMBER_ID);
        when(projectRepository.findByIdWithOwner(PROJECT_ID)).thenReturn(Optional.of(project()));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void memberCanCreateTaskAssignedToAnotherProjectMember() {
        when(memberRepository.existsByProjectIdAndUserId(PROJECT_ID, MEMBER_ID)).thenReturn(true);
        when(memberRepository.findByProjectId(PROJECT_ID)).thenReturn(List.of(member(MEMBER_ID)));
        when(taskRepository.save(any(ProjectTask.class))).thenAnswer(invocation -> {
            ProjectTask task = invocation.getArgument(0);
            task.setId(TASK_ID);
            task.setCreatedAt(LocalDateTime.now());
            return task;
        });
        when(userRepository.findById(MEMBER_ID)).thenReturn(Optional.of(user(MEMBER_ID)));
        CreateProjectTaskRequest request = new CreateProjectTaskRequest();
        request.setTitle("  Implement board  ");
        request.setAssigneeId(MEMBER_ID);

        var response = service.createTask(PROJECT_ID, request);

        assertEquals("Implement board", response.getTitle());
        assertEquals(MEMBER_ID, response.getAssignee().getId());
        assertEquals(ProjectTaskStatus.TODO, response.getStatus());
    }

    @Test
    void memberCannotAssignTaskToNonMember() {
        when(memberRepository.existsByProjectIdAndUserId(PROJECT_ID, MEMBER_ID)).thenReturn(true);
        when(memberRepository.findByProjectId(PROJECT_ID)).thenReturn(List.of(member(MEMBER_ID)));
        CreateProjectTaskRequest request = new CreateProjectTaskRequest();
        request.setTitle("Task");
        request.setAssigneeId(99L);

        assertThrows(ForbiddenException.class, () -> service.createTask(PROJECT_ID, request));
    }

    @Test
    void nonMemberCannotReadTasks() {
        authenticateAs(99L);
        when(memberRepository.existsByProjectIdAndUserId(PROJECT_ID, 99L)).thenReturn(false);

        assertThrows(ForbiddenException.class, () -> service.getTasks(PROJECT_ID));
    }

    @Test
    void memberCanMoveTaskBetweenColumns() {
        when(memberRepository.existsByProjectIdAndUserId(PROJECT_ID, MEMBER_ID)).thenReturn(true);
        ProjectTask task = task();
        when(taskRepository.findByIdAndProjectId(TASK_ID, PROJECT_ID)).thenReturn(Optional.of(task));
        when(memberRepository.findByProjectId(PROJECT_ID)).thenReturn(List.of(member(MEMBER_ID)));
        when(taskRepository.save(task)).thenReturn(task);
        UpdateProjectTaskStatusRequest request = new UpdateProjectTaskStatusRequest();
        request.setStatus(ProjectTaskStatus.IN_PROGRESS);

        var response = service.updateStatus(PROJECT_ID, TASK_ID, request);

        assertEquals(ProjectTaskStatus.IN_PROGRESS, response.getStatus());
        verify(taskRepository).save(task);
    }

    @Test
    void taskCreatorCanDeleteTheirTask() {
        ProjectTask task = task();
        when(memberRepository.existsByProjectIdAndUserId(PROJECT_ID, MEMBER_ID)).thenReturn(true);
        when(taskRepository.findByIdAndProjectId(TASK_ID, PROJECT_ID)).thenReturn(Optional.of(task));

        service.deleteTask(PROJECT_ID, TASK_ID);

        verify(taskRepository).delete(task);
    }

    @Test
    void projectOwnerCanDeleteTaskCreatedByAnotherMember() {
        authenticateAs(OWNER_ID);
        ProjectTask task = task();
        when(taskRepository.findByIdAndProjectId(TASK_ID, PROJECT_ID)).thenReturn(Optional.of(task));

        service.deleteTask(PROJECT_ID, TASK_ID);

        verify(taskRepository).delete(task);
    }

    private static Project project() {
        return Project.builder().id(PROJECT_ID).owner(user(OWNER_ID)).build();
    }

    private static ProjectMember member(Long userId) {
        return ProjectMember.builder().projectId(PROJECT_ID).userId(userId).role("MEMBER").build();
    }

    private static ProjectTask task() {
        return ProjectTask.builder()
                .id(TASK_ID)
                .projectId(PROJECT_ID)
                .createdById(MEMBER_ID)
                .title("Task")
                .status(ProjectTaskStatus.TODO)
                .build();
    }

    private static User user(Long userId) {
        return User.builder().id(userId).firstName("User").lastName(userId.toString()).build();
    }

    private static void authenticateAs(Long userId) {
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(userId, "test", List.of())
        );
    }
}
