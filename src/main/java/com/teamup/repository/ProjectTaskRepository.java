package com.teamup.repository;

import com.teamup.entity.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {
    List<ProjectTask> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    Optional<ProjectTask> findByIdAndProjectId(Long id, Long projectId);

    void deleteByProjectId(Long projectId);
}