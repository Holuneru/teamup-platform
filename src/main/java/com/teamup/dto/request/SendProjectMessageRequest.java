package com.teamup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SendProjectMessageRequest {

    @NotBlank
    @Size(max = 4000)
    private String content;

    @Size(max = 50)
    private List<Long> mentionedUserIds;
}