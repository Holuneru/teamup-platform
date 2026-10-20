package com.teamup.service;

import com.teamup.dto.request.CreateSkillRequest;
import com.teamup.dto.request.UpdateSkillsRequest;
import com.teamup.dto.response.SkillResponse;
import com.teamup.entity.Skill;
import com.teamup.entity.User;
import com.teamup.exception.SkillNotFoundException;
import com.teamup.exception.UserNotFoundException;
import com.teamup.mapper.SkillMapper;
import com.teamup.repository.SkillRepository;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final SkillMapper skillMapper;

    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll()
                .stream()
                .map(skillMapper::toResponse)
                .toList();
    }

    public SkillResponse createSkill(CreateSkillRequest request) {
        return skillRepository.findByName(request.getName())
                .map(skillMapper::toResponse)
                .orElseGet(() -> skillMapper.toResponse(
                        skillRepository.save(Skill.builder().name(request.getName()).build())
                ));
    }

    public List<SkillResponse> updateUserSkills(Long userId, UpdateSkillsRequest request) {

        Long currentUserId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        if (!currentUserId.equals(userId)) {
            throw new AccessDeniedException("You can only update your own skills");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Set<Skill> skills = new HashSet<>();

        for (Long skillId : request.getSkillIds()) {

            Skill skill = skillRepository.findById(skillId)
                    .orElseThrow(() -> new SkillNotFoundException(skillId));

            skills.add(skill);
        }

        user.setSkills(skills);

        userRepository.save(user);

        return skills.stream()
                .map(skillMapper::toResponse)
                .toList();
    }

}