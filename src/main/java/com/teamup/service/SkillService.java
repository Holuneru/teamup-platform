package com.teamup.service;

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

    public List<SkillResponse> updateUserSkills(Long userId, UpdateSkillsRequest request) {

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