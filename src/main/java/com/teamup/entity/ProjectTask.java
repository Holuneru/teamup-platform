package com.teamup.entity;

import com.teamup.enums.ProjectTaskPriority;
import com.teamup.enums.ProjectTaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_tasks", indexes = {
        @Index(name = "idx_project_tasks_project_status", columnList = "project_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "created_by_id", nullable = false)
    private Long createdById;

    @Column(name = "assignee_id")
    private Long assigneeId;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectTaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectTaskPriority priority;

    private LocalDate dueDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ProjectTaskStatus.TODO;
        }
        if (priority == null) {
            priority = ProjectTaskPriority.MEDIUM;
        }
    }
}