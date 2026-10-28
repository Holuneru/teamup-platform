package com.teamup.service;

import com.teamup.entity.Project;
import com.teamup.entity.ProjectInvitation;
import com.teamup.entity.User;
import com.teamup.enums.InvitationStatus;
import com.teamup.repository.ProjectInvitationRepository;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvitationServiceAuthorizationTest {

    private static final Long OWNER_ID = 1L;
    private static final Long INVITED_USER_ID = 2L;
    private static final Long OTHER_USER_ID = 3L;
    private static final Long PROJECT_ID = 10L;
    private static final Long INVITATION_ID = 30L;

    @Mock
    private ProjectInvitationRepository invitationRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectMemberRepository memberRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private InvitationService service;

    @BeforeEach
    void authenticateAsOtherUser() {
        authenticateAs(OTHER_USER_ID);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void nonOwnerCannotInviteUserToProject() {
        when(projectRepository.findById(PROJECT_ID))
                .thenReturn(Optional.of(Project.builder()
                        .id(PROJECT_ID)
                        .owner(User.builder().id(OWNER_ID).build())
                        .build()));

        assertThrows(AccessDeniedException.class,
                () -> service.invite(PROJECT_ID, INVITED_USER_ID));

        verifyNoInteractions(invitationRepository, memberRepository, userRepository);
    }

    @Test
    void userCannotAcceptInvitationAddressedToSomeoneElse() {
        when(invitationRepository.findById(INVITATION_ID))
                .thenReturn(Optional.of(invitation(INVITED_USER_ID)));

        assertThrows(AccessDeniedException.class, () -> service.accept(INVITATION_ID));

        verify(invitationRepository, never()).save(
                org.mockito.ArgumentMatchers.any(ProjectInvitation.class));
        verifyNoInteractions(memberRepository, projectRepository, userRepository);
    }

    @Test
    void userCannotRejectInvitationAddressedToSomeoneElse() {
        when(invitationRepository.findById(INVITATION_ID))
                .thenReturn(Optional.of(invitation(INVITED_USER_ID)));

        assertThrows(AccessDeniedException.class, () -> service.reject(INVITATION_ID));

        verify(invitationRepository, never()).save(
                org.mockito.ArgumentMatchers.any(ProjectInvitation.class));
        verifyNoInteractions(memberRepository, projectRepository, userRepository);
    }

    @Test
    void userCannotReadAnotherUsersInvitations() {
        assertThrows(AccessDeniedException.class,
                () -> service.getMyInvitations(INVITED_USER_ID));

        verifyNoInteractions(invitationRepository);
    }

    private static ProjectInvitation invitation(Long invitedUserId) {
        return ProjectInvitation.builder()
                .id(INVITATION_ID)
                .projectId(PROJECT_ID)
                .userId(invitedUserId)
                .status(InvitationStatus.PENDING)
                .build();
    }

    private static void authenticateAs(Long userId) {
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(userId, "test",
                        List.of())
        );
    }
}
