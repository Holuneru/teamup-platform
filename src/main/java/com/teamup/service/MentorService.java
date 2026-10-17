package com.teamup.service;

import com.teamup.dto.request.CreateMentorRequest;
import com.teamup.dto.response.MentorResponse;
import com.teamup.entity.Mentor;
import com.teamup.entity.Skill;
import com.teamup.exception.ResourceNotFoundException;
import com.teamup.mapper.MentorMapper;
import com.teamup.repository.MentorRepository;
import com.teamup.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final MentorRepository mentorRepository;
    private final SkillRepository skillRepository;
    private final MentorMapper mentorMapper;

    public List<MentorResponse> findAll() {
        return mentorRepository.findAll().stream()
                .map(mentorMapper::toResponse)
                .toList();
    }

    public MentorResponse getById(Long id) {
        return mentorMapper.toResponse(getEntity(id));
    }

    public MentorResponse create(CreateMentorRequest request) {
        Mentor mentor = Mentor.builder()
                .name(request.getName())
                .organization(request.getOrganization())
                .description(request.getDescription())
                .telegram(request.getTelegram())
                .email(request.getEmail())
                .skills(resolveSkills(request.getSkillIds()))
                .build();

        return mentorMapper.toResponse(mentorRepository.save(mentor));
    }

    public MentorResponse update(Long id, CreateMentorRequest request) {
        Mentor mentor = getEntity(id);

        mentor.setName(request.getName());
        mentor.setOrganization(request.getOrganization());
        mentor.setDescription(request.getDescription());
        mentor.setTelegram(request.getTelegram());
        mentor.setEmail(request.getEmail());
        mentor.setSkills(resolveSkills(request.getSkillIds()));

        return mentorMapper.toResponse(mentorRepository.save(mentor));
    }

    public void delete(Long id) {
        Mentor mentor = getEntity(id);
        mentorRepository.delete(mentor);
    }

    private Mentor getEntity(Long id) {
        return mentorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Наставник с id = " + id + " не найден"));
    }

    private Set<Skill> resolveSkills(Set<Long> skillIds) {
        if (skillIds == null || skillIds.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(skillRepository.findAllById(skillIds));
    }
}
