package com.teamup.dto.response;

import com.teamup.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApplicationResponse {

    private Long id;
    private Long projectId;
    private Long userId;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
}