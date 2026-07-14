package com.teamup.repository;

import com.teamup.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @EntityGraph(attributePaths = "skills")
    @Query("""
            SELECT DISTINCT u
            FROM User u
            LEFT JOIN u.skills s
            WHERE
                LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(u.university) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<User> searchUsers(String query);

}