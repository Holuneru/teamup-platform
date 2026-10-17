package com.teamup.service;

import com.teamup.dto.request.UpdateUserRequest;
import com.teamup.dto.response.UserResponse;
import com.teamup.entity.User;
import com.teamup.enums.ParticipationFormat;
import com.teamup.enums.Role;
import com.teamup.exception.UserNotFoundException;
import com.teamup.mapper.UserMapper;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

        String token = authHeader.substring(7);

        Long userId = jwtService.extractUserId(token);

        return getUserById(userId);


    }

    public List<UserResponse> searchUsers(String query) {

        String value = query == null ? "" : query;

        return userRepository.searchUsers(value)
                .stream()
                .map(userMapper::toResponse)
                .toList();

    }

    public List<UserResponse> findUsers(
            String university,
            String skill,
            Role role,
            ParticipationFormat format
    ) {
        return userRepository.findAll().stream()
                .filter(user -> university == null || university.isBlank()
                        || (user.getUniversity() != null
                        && user.getUniversity().toLowerCase().contains(university.toLowerCase())))
                .filter(user -> skill == null || skill.isBlank()
                        || user.getSkills().stream()
                        .anyMatch(item -> item.getName().equalsIgnoreCase(skill)))
                .filter(user -> role == null || user.getRole() == role)
                .filter(user -> format == null || user.getParticipationFormat() == format
                        || user.getParticipationFormat() == ParticipationFormat.BOTH)
                .map(userMapper::toResponse)
                .toList();
    }

    // ===========================
    // UPDATE PROFILE
    // ===========================

    public UserResponse updateMe(
            String authHeader,
            UpdateUserRequest request
    ) {

        String token = authHeader.substring(7);

        Long userId = jwtService.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUniversity(request.getUniversity());
        user.setCourse(request.getCourse());
        user.setAbout(request.getAbout());
        user.setTelegram(request.getTelegram());
        user.setGithub(request.getGithub());
        user.setLookingForTeam(request.getLookingForTeam());
        if (request.getParticipationFormat() != null) {
            user.setParticipationFormat(request.getParticipationFormat());
        }

        userRepository.save(user);

        return userMapper.toResponse(user);

    }


    public Long extractUserId(String token) {
        return jwtService.extractUserId(token);
    }

}