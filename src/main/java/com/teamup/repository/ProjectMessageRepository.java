package com.teamup.repository;

import com.teamup.entity.ProjectMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectMessageRepository extends JpaRepository<ProjectMessage, Long> {
    List<ProjectMessage> findTop100ByProjectIdOrderByIdDesc(Long projectId);

    void deleteByProjectId(Long projectId);
}