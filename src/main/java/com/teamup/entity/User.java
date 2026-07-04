package com.teamup.entity;

import com.teamup.enums.ParticipationFormat;
import com.teamup.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String university;

    private Integer course;

    @Column(length = 1000)
    private String about;

    private String telegram;

    private String github;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    private ParticipationFormat participationFormat;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;


    @ManyToMany
    @JoinTable(
            name = "user_skills",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();


    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (role == null) {
            role = Role.USER;
        }

        if (participationFormat == null) {
            participationFormat = ParticipationFormat.BOTH;
        }
    }
}