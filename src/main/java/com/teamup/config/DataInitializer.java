package com.teamup.config;

import com.teamup.entity.Skill;
import com.teamup.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final SkillRepository skillRepository;

    @Override
    public void run(String... args) {

        if (skillRepository.count() > 0) {
            return;
        }

        List<String> skills = List.of(
                "Java",
                "Spring Boot",
                "PostgreSQL",
                "Docker",
                "Git",
                "Python",
                "C++",
                "JavaScript",
                "React",
                "HTML",
                "CSS",
                "Figma",
                "UI/UX",
                "Marketing",
                "Machine Learning"
        );

        skills.stream()
                .map(name -> Skill.builder().name(name).build())
                .forEach(skillRepository::save);

        System.out.println("Skills initialized.");
    }
}