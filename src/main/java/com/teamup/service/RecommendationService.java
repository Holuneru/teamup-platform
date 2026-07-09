package com.teamup.service;

import com.teamup.dto.response.UserRecommendationResponse;
import com.teamup.entity.Project;
import com.teamup.entity.ProjectApplication;
import com.teamup.entity.Skill;
import com.teamup.entity.User;
import com.teamup.enums.ApplicationStatus;
import com.teamup.repository.ProjectApplicationRepository;
import com.teamup.repository.ProjectMemberRepository;
import com.teamup.repository.ProjectRepository;
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
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final ProjectApplicationRepository applicationRepository;

    public List<UserRecommendationResponse> getRecommendations(Long projectId) {

        Project project = projectRepository.findByIdWithEverything(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Пользователи, которых не нужно показывать
        Set<Long> excludedUsers = memberRepository.findByProjectId(projectId)
                .stream()
                .map(member -> member.getUserId())
                .collect(Collectors.toSet());

        // Владелец проекта
        excludedUsers.add(project.getOwner().getId());

        // Пользователи с ожидающей заявкой
        applicationRepository
                .findByProjectIdAndStatus(projectId, ApplicationStatus.PENDING)
                .stream()
                .map(ProjectApplication::getUserId)
                .forEach(excludedUsers::add);

        Set<String> requiredSkills = project.getRequiredSkills()
                .stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return userRepository.findAll()
                .stream()
                .filter(user -> !excludedUsers.contains(user.getId()))
                .map(user -> buildRecommendation(requiredSkills, user))
                .filter(recommendation -> recommendation.getMatchPercent() > 0)
                .sorted(
                        Comparator.comparing(UserRecommendationResponse::getMatchPercent)
                                .reversed()
                )
                .limit(20)
                .toList();
    }

    private UserRecommendationResponse buildRecommendation(
            Set<String> requiredSkills,
            User user
    ) {

        Set<String> userSkills = user.getSkills()
                .stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        Set<String> matchedSkills = requiredSkills.stream()
                .filter(userSkills::contains)
                .collect(Collectors.toSet());

        int matchPercent = requiredSkills.isEmpty()
                ? 0
                : matchedSkills.size() * 100 / requiredSkills.size();

        return UserRecommendationResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .university(user.getUniversity())
                .avatarUrl(user.getAvatarUrl())
                .matchedSkills(matchedSkills)
                .matchPercent(matchPercent)
                .build();
    }
}