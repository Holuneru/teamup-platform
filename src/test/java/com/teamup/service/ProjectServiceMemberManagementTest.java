package com.teamup.service;

import com.teamup.entity.Project;
import com.teamup.entity.ProjectApplication;
import com.teamup.entity.ProjectInvitation;
import com.teamup.entity.User;
import com.teamup.enums.ApplicationStatus;
import com.teamup.enums.InvitationStatus;
import com.teamup.exception.ForbiddenException;
import com.teamup.repository.ProjectApplicationRepository;
import com.teamup.repository.ProjectInvitationRepository;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.SkillRepository;
import com.teamup.repository.UserRepository;
import com.teamup.mapper.ProjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceMemberManagementTest {

    private static final Long OWNER_ID = 1L;
    private static final Long MEMBER_ID = 2L;
    private static final Long PROJECT_ID = 10L;

    @Mock
    private ProjectMemberRepository projectMemberRepository;
    @Mock
    private ProjectInvitationRepository projectInvitationRepository;
    @Mock
    private ProjectApplicationRepository projectApplicationRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SkillRepository skillRepository;
    @Mock
    private ProjectMapper projectMapper;

    @InjectMocks
    private ProjectService service;

    @BeforeEach
    void authenticateAsOwner() {
        authenticateAs(OWNER_ID);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void ownerCanRemoveMemberAndClosePreviousApplicationAndInvitation() {
        ProjectApplication application = ProjectApplication.builder()
                .projectId(PROJECT_ID)
                .userId(MEMBER_ID)
                .status(ApplicationStatus.ACCEPTED)
                .build();
        ProjectInvitation invitation = ProjectInvitation.builder()
                .projectId(PROJECT_ID)
                .userId(MEMBER_ID)
                .status(InvitationStatus.ACCEPTED)
                .build();
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project()));
        when(projectMemberRepository.existsByProjectIdAndUserId(PROJECT_ID, MEMBER_ID)).thenReturn(true);
        when(projectApplicationRepository.findTopByProjectIdAndUserIdOrderByCreatedAtDesc(PROJECT_ID, MEMBER_ID))
                .thenReturn(Optional.of(application));
        when(projectInvitationRepository.findByProjectIdAndUserId(PROJECT_ID, MEMBER_ID))
                .thenReturn(Optional.of(invitation));

        service.removeMember(PROJECT_ID, MEMBER_ID);

        verify(projectMemberRepository).deleteByProjectIdAndUserId(PROJECT_ID, MEMBER_ID);
        verify(projectApplicationRepository).save(application);
        verify(projectInvitationRepository).save(invitation);
        assertEquals(ApplicationStatus.REMOVED, application.getStatus());
        assertEquals(InvitationStatus.REJECTED, invitation.getStatus());
    }

    @Test
    void nonOwnerCannotRemoveMember() {
        authenticateAs(MEMBER_ID);
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project()));

        assertThrows(ForbiddenException.class, () -> service.removeMember(PROJECT_ID, MEMBER_ID));

        verifyNoInteractions(projectMemberRepository, projectApplicationRepository, projectInvitationRepository);
    }

    @Test
    void ownerCannotRemoveSelf() {
        when(projectRepository.findById(PROJECT_ID)).thenReturn(Optional.of(project()));

        assertThrows(ForbiddenException.class, () -> service.removeMember(PROJECT_ID, OWNER_ID));

        verify(projectMemberRepository, never()).deleteByProjectIdAndUserId(PROJECT_ID, OWNER_ID);
        verifyNoInteractions(projectApplicationRepository, projectInvitationRepository);
    }

    private static Project project() {
        return Project.builder()
                .id(PROJECT_ID)
                .owner(User.builder().id(OWNER_ID).build())
                .build();
    }

    private static void authenticateAs(Long userId) {
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(userId, "test", List.of())
        );
    }
}