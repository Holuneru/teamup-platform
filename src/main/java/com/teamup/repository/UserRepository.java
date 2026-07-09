package com.teamup.repository;

import com.teamup.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = "skills")
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = "skills")
    Optional<User> findWithSkillsById(Long id);

    @EntityGraph(attributePaths = "skills")
    List<User> findAll();

    @EntityGraph(attributePaths = "skills")
    @Override
    Optional<User> findById(Long id);

}