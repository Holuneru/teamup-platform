package com.teamup.service;

import com.teamup.dto.request.CreateApplicationRequest;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectApplication;
import com.teamup.entity.User;
import com.teamup.enums.ApplicationStatus;
import com.teamup.repository.ProjectApplicationRepository;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
import com.teamup.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectApplicationServiceAuthorizationTest {

    private static final Long OWNER_ID = 1L;
    private static final Long APPLICANT_ID = 2L;
    private static final Long OTHER_USER_ID = 3L;
    private static final Long PROJECT_ID = 10L;
    private static final Long APPLICATION_ID = 20L;

    @Mock
    private ProjectApplicationRepository applicationRepository;
    @Mock
    private ProjectMemberRepository projectMemberRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectMemberService memberService;
    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectApplicationService service;

    @BeforeEach
    void authenticateAsOtherUser() {
        authenticateAs(OTHER_USER_ID);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void nonOwnerCannotListProjectApplications() {
        when(projectRepository.findByIdWithOwner(PROJECT_ID))
                .thenReturn(Optional.of(project(PROJECT_ID, OWNER_ID)));

        assertThrows(AccessDeniedException.class, () -> service.getByProject(PROJECT_ID));

        verifyNoInteractions(applicationRepository);
    }

    @Test
    void nonOwnerCannotAcceptApplication() {
        when(applicationRepository.findById(APPLICATION_ID))
                .thenReturn(Optional.of(application(APPLICATION_ID, PROJECT_ID, APPLICANT_ID)));
        when(projectRepository.findByIdWithOwner(PROJECT_ID))
                .thenReturn(Optional.of(project(PROJECT_ID, OWNER_ID)));

        assertThrows(AccessDeniedException.class, () -> service.accept(APPLICATION_ID));

        verify(applicationRepository, never()).save(any(ProjectApplication.class));
        verifyNoInteractions(memberService);
    }

    @Test
    void nonOwnerCannotRejectApplication() {
        when(applicationRepository.findById(APPLICATION_ID))
                .thenReturn(Optional.of(application(APPLICATION_ID, PROJECT_ID, APPLICANT_ID)));
        when(projectRepository.findByIdWithOwner(PROJECT_ID))
                .thenReturn(Optional.of(project(PROJECT_ID, OWNER_ID)));

        assertThrows(AccessDeniedException.class, () -> service.reject(APPLICATION_ID));

        verify(applicationRepository, never()).save(any(ProjectApplication.class));
        verifyNoInteractions(memberService);
    }

    @Test
    void applicantIdComesFromAuthenticatedPrincipalNotRequestBody() {
        authenticateAs(APPLICANT_ID);
        when(projectRepository.findByIdWithOwner(PROJECT_ID))
                .thenReturn(Optional.of(project(PROJECT_ID, OWNER_ID)));
        when(applicationRepository.findByProjectIdAndUserId(PROJECT_ID, APPLICANT_ID))
                .thenReturn(Optional.empty());
        when(applicationRepository.save(any(ProjectApplication.class)))
                .thenAnswer(invocation -> {
                    ProjectApplication saved = invocation.getArgument(0);
                    saved.setId(APPLICATION_ID);
                    return saved;
                });
        when(userRepository.findById(APPLICANT_ID))
                .thenReturn(Optional.of(User.builder()
                        .id(APPLICANT_ID)
                        .firstName("Applicant")
                        .lastName("User")
                        .build()));

        CreateApplicationRequest request = new CreateApplicationRequest();
        request.setUserId(OTHER_USER_ID);

        service.apply(PROJECT_ID, request);

        ArgumentCaptor<ProjectApplication> captor =
                ArgumentCaptor.forClass(ProjectApplication.class);
        verify(applicationRepository).save(captor.capture());
        assertEquals(APPLICANT_ID, captor.getValue().getUserId());
        assertEquals(ApplicationStatus.PENDING, captor.getValue().getStatus());
    }

    @Test
    void unrelatedUserCannotDeleteApplication() {
        when(applicationRepository.findById(APPLICATION_ID))
                .thenReturn(Optional.of(application(APPLICATION_ID, PROJECT_ID, APPLICANT_ID)));
        when(projectRepository.findByIdWithOwner(PROJECT_ID))
                .thenReturn(Optional.of(project(PROJECT_ID, OWNER_ID)));

        assertThrows(AccessDeniedException.class, () -> service.delete(APPLICATION_ID));

        verify(applicationRepository, never()).delete(any(ProjectApplication.class));
    }

    private static Project project(Long projectId, Long ownerId) {
        return Project.builder()
                .id(projectId)
                .title("Test project")
                .owner(User.builder().id(ownerId).build())
                .build();
    }

    private static ProjectApplication application(Long id, Long projectId, Long applicantId) {
        return ProjectApplication.builder()
                .id(id)
                .projectId(projectId)
                .userId(applicantId)
                .status(ApplicationStatus.PENDING)
                .build();
    }

    private static void authenticateAs(Long userId) {
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(userId, "test",
                        List.of())
        );
    }
}
