package com.teamup.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TaskCommentResponse {
    private Long id;
    private Long projectId;
    private Long taskId;
    private Long authorId;
    private UserShortResponse author;
    private String content;
    private LocalDateTime createdAt;
}
