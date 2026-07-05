package com.teamup.exception;

public class SkillNotFoundException extends RuntimeException {

    public SkillNotFoundException(Long id) {
        super("Навык с id = " + id + " не найден");
    }

}