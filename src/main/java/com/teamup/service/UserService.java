package com.teamup.service;

import com.teamup.dto.request.LoginRequest;
import com.teamup.dto.request.RegisterRequest;
import com.teamup.dto.response.UserResponse;
import com.teamup.entity.User;
import com.teamup.mapper.UserMapper;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .university(request.getUniversity())
                .course(request.getCourse())
                .about(request.getAbout())
                .telegram(request.getTelegram())
                .github(request.getGithub())
                .avatarUrl(request.getAvatarUrl())
                .build();

        userRepository.save(user);

        return userMapper.toResponse(user);
    }

    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }

        return userMapper.toResponse(user);
    }
}