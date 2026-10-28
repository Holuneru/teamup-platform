package com.teamup.service;

import com.teamup.dto.request.UpdateSkillsRequest;
import com.teamup.repository.SkillRepository;
import com.teamup.repository.UserRepository;
import com.teamup.mapper.SkillMapper;
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
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class SkillServiceAuthorizationTest {

    private static final Long CURRENT_USER_ID = 1L;
    private static final Long OTHER_USER_ID = 2L;

    @Mock
    private SkillRepository skillRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SkillMapper skillMapper;

    @InjectMocks
    private SkillService service;

    @BeforeEach
    void authenticateAsCurrentUser() {
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(
                        CURRENT_USER_ID, "test", List.of()));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void userCannotUpdateAnotherUsersSkills() {
        UpdateSkillsRequest request = new UpdateSkillsRequest();
        request.setSkillIds(Set.of(1L, 2L));

        assertThrows(AccessDeniedException.class,
                () -> service.updateUserSkills(OTHER_USER_ID, request));

        verifyNoInteractions(userRepository, skillRepository, skillMapper);
    }
}
