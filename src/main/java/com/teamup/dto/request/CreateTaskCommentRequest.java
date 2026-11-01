package com.teamup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTaskCommentRequest {

    @NotBlank(message = "Комментарий не может быть пустым")
    @Size(max = 2000, message = "Комментарий должен быть до 2000 символов")
    private String content;
}
