package com.teamup.service;

import com.teamup.entity.ProjectMember;
import com.teamup.repository.ProjectMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final ProjectMemberRepository repository;

    public void addMember(Long projectId, Long userId) {

        repository.findByProjectIdAndUserId(projectId, userId)
                .ifPresent(member -> {
                    throw new RuntimeException("User is already a member");
                });

        ProjectMember member = ProjectMember.builder()
                .projectId(projectId)
                .userId(userId)
                .role("MEMBER")
                .build();

        repository.save(member);
    }

    public void removeMember(Long projectId, Long userId) {

        repository.findByProjectIdAndUserId(projectId, userId)
                .ifPresent(repository::delete);

    }

}