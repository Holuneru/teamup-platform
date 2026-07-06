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
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
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

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getId());

        return LoginResponse.builder()
                .user(userMapper.toResponse(user))
                .token(token)
                .build();
    }

    /*
    TODO спросить у ChatGPT как это можно протестировать и что делаем дальше. Сказать что ты
     решил написать String token = jwtService.generateToken(user.getId());
     также сказать что надо закончить настройку Security чтобы можно было спокойно добавлять
     нужные фичи не делая какието тестовые запросы через userId=1 , а по нормальной аунтификации.
     Также спросить надоли на данный момент чтото писать на фронтенде (ChatGPT чтото говорил про сохранении
     токена на фронтенде в LocalStorage)
     */
}