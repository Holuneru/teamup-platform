package com.teamup.repository;

import com.teamup.entity.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @EntityGraph(attributePaths = {"requiredSkills", "owner"})
    List<Project> findAll();

    List<Project> findByOwnerId(Long ownerId);

    Optional<Project> findById(Long id);

    @Query("select p from Project p left join fetch p.members where p.id = :id")
    Optional<Project> findByIdWithMembers(Long id);

}