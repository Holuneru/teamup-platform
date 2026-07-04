package com.teamup.entity;

import com.teamup.enums.ParticipationFormat;
import com.teamup.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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