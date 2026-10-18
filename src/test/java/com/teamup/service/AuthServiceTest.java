package com.teamup.service;

import com.teamup.dto.request.LoginRequest;
import com.teamup.dto.request.RegisterRequest;
import com.teamup.dto.response.LoginResponse;
import com.teamup.dto.response.UserResponse;
import com.teamup.entity.User;
import com.teamup.exception.EmailAlreadyExistsException;
import com.teamup.exception.InvalidCredentialsException;
import com.teamup.mapper.UserMapper;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String EMAIL = "student@example.com";
    private static final String RAW_PASSWORD = "plain-password";
    private static final String ENCODED_PASSWORD = "encoded-password";
    private static final Long USER_ID = 42L;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_whenEmailIsNew_encodesPasswordAndReturnsUserResponse() {
        RegisterRequest request = validRegisterRequest();
        UserResponse expectedResponse = UserResponse.builder()
                .id(USER_ID)
                .email(EMAIL)
                .firstName("Ada")
                .lastName("Lovelace")
                .build();

        when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(RAW_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(USER_ID);
            return user;
        });
        when(userMapper.toResponse(any(User.class))).thenReturn(expectedResponse);

        UserResponse actualResponse = authService.register(request);

        assertSame(expectedResponse, actualResponse);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("Ada", savedUser.getFirstName());
        assertEquals("Lovelace", savedUser.getLastName());
        assertEquals(EMAIL, savedUser.getEmail());
        assertEquals(ENCODED_PASSWORD, savedUser.getPassword());
        verify(passwordEncoder).encode(RAW_PASSWORD);
        verify(userMapper).toResponse(savedUser);
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void register_whenEmailAlreadyExists_throwsAndDoesNotSaveUser() {
        RegisterRequest request = validRegisterRequest();
        when(userRepository.existsByEmail(EMAIL)).thenReturn(true);

        assertThrows(
                EmailAlreadyExistsException.class,
                () -> authService.register(request)
        );

        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(passwordEncoder, userMapper, jwtService);
    }

    @Test
    void login_whenCredentialsAreValid_returnsUserAndJwt() {
        User user = User.builder()
                .id(USER_ID)
                .firstName("Ada")
                .lastName("Lovelace")
                .email(EMAIL)
                .password(ENCODED_PASSWORD)
                .build();
        UserResponse expectedUser = UserResponse.builder()
                .id(USER_ID)
                .email(EMAIL)
                .build();
        LoginRequest request = validLoginRequest();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(RAW_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtService.generateToken(USER_ID)).thenReturn("signed-jwt");
        when(userMapper.toResponse(user)).thenReturn(expectedUser);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("signed-jwt", response.getToken());
        assertSame(expectedUser, response.getUser());
        verify(jwtService).generateToken(USER_ID);
        verify(userMapper).toResponse(user);
    }

    @Test
    void login_whenEmailDoesNotExist_throwsInvalidCredentials() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(validLoginRequest())
        );

        verifyNoInteractions(passwordEncoder, jwtService, userMapper);
    }

    @Test
    void login_whenPasswordDoesNotMatch_throwsInvalidCredentials() {
        User user = User.builder()
                .id(USER_ID)
                .firstName("Ada")
                .lastName("Lovelace")
                .email(EMAIL)
                .password(ENCODED_PASSWORD)
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(RAW_PASSWORD, ENCODED_PASSWORD)).thenReturn(false);

        assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(validLoginRequest())
        );

        verifyNoInteractions(jwtService, userMapper);
    }

    private RegisterRequest validRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Ada");
        request.setLastName("Lovelace");
        request.setEmail(EMAIL);
        request.setPassword(RAW_PASSWORD);
        request.setUniversity("Example University");
        request.setCourse(1);
        return request;
    }

    private LoginRequest validLoginRequest() {
        LoginRequest request = new LoginRequest();
        request.setEmail(EMAIL);
        request.setPassword(RAW_PASSWORD);
        return request;
    }
}
