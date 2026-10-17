package com.teamup.entity;

import com.teamup.enums.HackathonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "hackathons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 4000)
    private String description;

    private LocalDate deadline;

    private String location;

    @Enumerated(EnumType.STRING)
    private HackathonFormat format;

    private String prize;

    private String link;
}
