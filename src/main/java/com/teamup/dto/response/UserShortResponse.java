package com.teamup.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserShortResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String avatarUrl;
}