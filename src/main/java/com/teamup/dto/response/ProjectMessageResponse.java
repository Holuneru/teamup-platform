package com.teamup.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProjectMessageResponse {
    private Long id;
    private Long senderId;
    private String senderFirstName;
    private String senderLastName;
    private String senderAvatarUrl;
    private boolean senderIsCurrentMember;
    private String content;
    private LocalDateTime createdAt;
}