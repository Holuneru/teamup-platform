package com.teamup.mapper;

import com.teamup.dto.response.UserResponse;
import com.teamup.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .university(user.getUniversity())
                .course(user.getCourse())
                .about(user.getAbout())
                .telegram(user.getTelegram())
                .github(user.getGithub())
                .avatarUrl(user.getAvatarUrl())
                .participationFormat(user.getParticipationFormat())
                .role(user.getRole())
                .build();
    }
}