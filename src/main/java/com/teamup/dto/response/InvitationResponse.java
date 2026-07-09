package com.teamup.dto.response;

import com.teamup.enums.InvitationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InvitationResponse {

    private Long id;

    private Long projectId;

    private String projectTitle;

    private UserShortResponse inviter;

    private InvitationStatus status;

    private LocalDateTime createdAt;

}