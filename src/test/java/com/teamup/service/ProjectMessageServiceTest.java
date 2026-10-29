package com.teamup.service;

import com.teamup.dto.request.SendProjectMessageRequest;
import com.teamup.dto.response.ProjectMessageResponse;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectMember;
import com.teamup.entity.ProjectMessage;
import com.teamup.entity.User;
import com.teamup.exception.ForbiddenException;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectMessageRepository;
import com.teamup.repository.ProjectRepository;
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
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectMessageServiceTest {

    private static final Long OWNER_ID = 1L;
    private static final Long MEMBER_ID = 2L;
    private static final Long FORMER_MEMBER_ID = 3L;
    private static final Long PROJECT_ID = 10L;

    @Mock
    private ProjectMessageRepository messageRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectMemberRepository memberRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectMessageService service;

    @BeforeEach
    void setUp() {
        when(projectRepository.findByIdWithOwner(PROJECT_ID)).thenReturn(Optional.of(project()));
        authenticateAs(OWNER_ID);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void ownerCanReadMessagesIncludingFormerMemberHistory() {
        ProjectMessage message = message(FORMER_MEMBER_ID, "Сообщение до выхода");
        when(memberRepository.findByProjectId(PROJECT_ID))
                .thenReturn(List.of(member(MEMBER_ID)));
        when(messageRepository.findTop100ByProjectIdOrderByIdDesc(PROJECT_ID))
                .thenReturn(List.of(message));
        when(userRepository.findById(FORMER_MEMBER_ID))
                .thenReturn(Optional.of(user(FORMER_MEMBER_ID)));

        List<ProjectMessageResponse> result = service.getMessages(PROJECT_ID);

        assertEquals(1, result.size());
        assertEquals("Сообщение до выхода", result.get(0).getContent());
        assertEquals(FORMER_MEMBER_ID, result.get(0).getSenderId());
        assertFalse(result.get(0).isSenderIsCurrentMember());
    }

    @Test
    void currentMemberCanSendMessage() {
        authenticateAs(MEMBER_ID);
        when(memberRepository.existsByProjectIdAndUserId(PROJECT_ID, MEMBER_ID)).thenReturn(true);
        when(memberRepository.findByProjectId(PROJECT_ID)).thenReturn(List.of(member(MEMBER_ID)));
        when(messageRepository.save(any(ProjectMessage.class))).thenAnswer(invocation -> {
            ProjectMessage message = invocation.getArgument(0);
            message.setId(50L);
            message.setCreatedAt(LocalDateTime.now());
            return message;
        });
        when(userRepository.findById(MEMBER_ID)).thenReturn(Optional.of(user(MEMBER_ID)));
        SendProjectMessageRequest request = new SendProjectMessageRequest();
        request.setContent("  Привет команде  ");

        ProjectMessageResponse result = service.sendMessage(PROJECT_ID, request);

        assertEquals("Привет команде", result.getContent());
        assertTrue(result.isSenderIsCurrentMember());
        verify(messageRepository).save(any(ProjectMessage.class));
    }

    @Test
    void unrelatedUserCannotReadOrSendMessages() {
        authenticateAs(99L);
        when(memberRepository.existsByProjectIdAndUserId(PROJECT_ID, 99L)).thenReturn(false);

        assertThrows(ForbiddenException.class, () -> service.getMessages(PROJECT_ID));

        SendProjectMessageRequest request = new SendProjectMessageRequest();
        request.setContent("Попытка написать");
        assertThrows(ForbiddenException.class, () -> service.sendMessage(PROJECT_ID, request));
    }

    private static Project project() {
        return Project.builder()
                .id(PROJECT_ID)
                .owner(user(OWNER_ID))
                .build();
    }

    private static ProjectMember member(Long userId) {
        return ProjectMember.builder()
                .projectId(PROJECT_ID)
                .userId(userId)
                .role("MEMBER")
                .build();
    }

    private static ProjectMessage message(Long senderId, String content) {
        return ProjectMessage.builder()
                .id(40L)
                .projectId(PROJECT_ID)
                .senderId(senderId)
                .content(content)
                .createdAt(LocalDateTime.now().minusMinutes(1))
                .build();
    }

    private static User user(Long userId) {
        return User.builder()
                .id(userId)
                .firstName("User")
                .lastName(userId.toString())
                .build();
    }

    private static void authenticateAs(Long userId) {
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(userId, "test", List.of())
        );
    }
}
