package com.teamup.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Имя обязательно")
    private String firstName;

    @NotBlank(message = "Фамилия обязательна")
    private String lastName;

    @Email(message = "Некорректный email")
    @NotBlank(message = "Email обязателен")
    private String email;

    @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
    private String password;

    private String university;

    private Integer course;

    private String about;

    private String telegram;

    private String github;

    private String avatarUrl;
}