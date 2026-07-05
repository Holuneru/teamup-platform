package com.teamup.service;

import com.teamup.dto.response.UserRecommendationResponse;
import com.teamup.entity.Skill;
import com.teamup.entity.User;
import com.teamup.exception.UserNotFoundException;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserRepository userRepository;

    public List<UserRecommendationResponse> getRecommendations(Long userId) {

        User currentUser = userRepository.findWithSkillsById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .map(user -> buildRecommendation(currentUser, user))
                .filter(r -> r.getMatchPercent() > 0)
                .sorted(Comparator.comparing(UserRecommendationResponse::getMatchPercent).reversed())
                .limit(10)
                .toList();
    }

    private UserRecommendationResponse buildRecommendation(User currentUser, User candidate) {

        Set<String> currentSkills = currentUser.getSkills()
                .stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        Set<String> candidateSkills = candidate.getSkills()
                .stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        Set<String> matchedSkills = currentSkills.stream()
                .filter(candidateSkills::contains)
                .collect(Collectors.toSet());

        int matchPercent = currentSkills.isEmpty()
                ? 0
                : (matchedSkills.size() * 100) / currentSkills.size();

        return UserRecommendationResponse.builder()
                .id(candidate.getId())
                .firstName(candidate.getFirstName())
                .lastName(candidate.getLastName())
                .university(candidate.getUniversity())
                .avatarUrl(candidate.getAvatarUrl())
                .matchedSkills(matchedSkills)
                .matchPercent(matchPercent)
                .build();
    }
}