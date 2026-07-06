package com.teamup.service;

import com.teamup.dto.response.UserResponse;
import com.teamup.entity.User;
import com.teamup.exception.UserNotFoundException;
import com.teamup.mapper.UserMapper;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    public UserResponse getUserById(Long id) {

        User user = userRepository.findWithSkillsById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return userMapper.toResponse(user);
    }

    public UserResponse getMe(String authHeader) {

        String token = authHeader.substring(7); // убрать "Bearer "

        Long userId = jwtService.extractUserId(token);

        return getUserById(userId);
    }

}