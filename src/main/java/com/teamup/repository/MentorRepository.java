package com.teamup.repository;

import com.teamup.entity.Mentor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {

    @EntityGraph(attributePaths = "skills")
    @Override
    List<Mentor> findAll();

    @EntityGraph(attributePaths = "skills")
    @Override
    Optional<Mentor> findById(Long id);
}
