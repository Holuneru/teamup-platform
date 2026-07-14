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

    @Query("""
    select p from Project p
    left join fetch p.members
    left join fetch p.requiredSkills
    where p.id = :id
""")
    Optional<Project> findByIdWithMembers(Long id);


    @Query("""
    select distinct p from Project p
    left join fetch p.members
    left join fetch p.requiredSkills
""")
    List<Project> findAllWithMembers();

    @Query("""
    select distinct p from Project p
    left join fetch p.members
    left join fetch p.requiredSkills
""")
    List<Project> findAllWithMembersAndSkills();

    @Query("""
    select distinct p from Project p
    left join fetch p.members
    left join fetch p.requiredSkills
    where p.owner.id = :ownerId
""")
    List<Project> findByOwnerIdWithMembers(Long ownerId);

    @Query("""
select p from Project p
left join fetch p.requiredSkills
left join fetch p.owner
where p.id = :id
""")
    Optional<Project> findByIdWithEverything(Long id);



    @Query("""
select distinct p from Project p
left join fetch p.members
left join fetch p.requiredSkills
where exists (
    select m from ProjectMember m
    where m.projectId = p.id
      and m.userId = :userId
)
and p.owner.id <> :userId
""")
    List<Project> findProjectsWhereUserIsMember(Long userId);
}