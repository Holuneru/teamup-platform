package com.teamup.repository;

import com.teamup.entity.ProjectApplication;
import com.teamup.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {

    List<ProjectApplication> findByProjectId(Long projectId);

    Optional<ProjectApplication> findByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectApplication> findByProjectIdAndStatus(
            Long projectId,
            ApplicationStatus status
    );

    List<ProjectApplication> findAllByProjectIdAndStatus(
            Long projectId,
            ApplicationStatus status
    );

}