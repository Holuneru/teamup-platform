package com.teamup.config;

import com.teamup.entity.Hackathon;
import com.teamup.entity.Mentor;
import com.teamup.entity.Skill;
import com.teamup.enums.HackathonFormat;
import com.teamup.repository.HackathonRepository;
import com.teamup.repository.MentorRepository;
import com.teamup.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final SkillRepository skillRepository;
    private final HackathonRepository hackathonRepository;
    private final MentorRepository mentorRepository;

    @Override
    public void run(String... args) {
        initSkills();
        initHackathons();
        initMentors();
    }

    private void initSkills() {
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

        log.info("Skills initialized.");
    }

    private void initHackathons() {
        if (hackathonRepository.count() > 0) {
            return;
        }

        hackathonRepository.saveAll(List.of(
                Hackathon.builder()
                        .title("Campus Code Sprint")
                        .description("Студенческий хакатон по веб-разработке и продуктам для университета.")
                        .deadline(LocalDate.now().plusDays(21))
                        .location("Онлайн")
                        .format(HackathonFormat.ONLINE)
                        .prize("100 000 ₽ и менторская поддержка")
                        .link("https://example.com/campus-code")
                        .build(),
                Hackathon.builder()
                        .title("AI for Students")
                        .description("Хакатон по машинному обучению: от идеи до рабочего прототипа за 48 часов.")
                        .deadline(LocalDate.now().plusDays(40))
                        .location("Москва")
                        .format(HackathonFormat.OFFLINE)
                        .prize("Стажировки и призы от партнёров")
                        .link("https://example.com/ai-students")
                        .build(),
                Hackathon.builder()
                        .title("Green Tech Weekend")
                        .description("Гибридный хакатон про экологичные цифровые решения.")
                        .deadline(LocalDate.now().plusDays(60))
                        .location("Санкт-Петербург + онлайн")
                        .format(HackathonFormat.HYBRID)
                        .prize("Грант на развитие проекта")
                        .link("https://example.com/green-tech")
                        .build()
        ));

        log.info("Hackathons initialized.");
    }

    private void initMentors() {
        if (mentorRepository.count() > 0) {
            return;
        }

        Set<Skill> allSkills = skillRepository.findAll().stream().collect(Collectors.toSet());
        Skill java = findSkill(allSkills, "Java");
        Skill spring = findSkill(allSkills, "Spring Boot");
        Skill python = findSkill(allSkills, "Python");
        Skill ml = findSkill(allSkills, "Machine Learning");
        Skill react = findSkill(allSkills, "React");
        Skill ux = findSkill(allSkills, "UI/UX");

        mentorRepository.saveAll(List.of(
                Mentor.builder()
                        .name("Анна Соколова")
                        .organization("Яндекс")
                        .description("Backend-разработчик. Помогаю студентам собрать первый рабочий API и понять архитектуру.")
                        .telegram("anna_mentor")
                        .email("anna.sokolova@example.com")
                        .skills(nonNullSkills(java, spring))
                        .build(),
                Mentor.builder()
                        .name("Игорь Петров")
                        .organization("Сбер")
                        .description("Специалист по ML. Разбираю pet-проекты, данные и как презентовать модели.")
                        .telegram("igor_ml")
                        .email("igor.petrov@example.com")
                        .skills(nonNullSkills(python, ml))
                        .build(),
                Mentor.builder()
                        .name("Мария Ким")
                        .organization("Независимый дизайнер")
                        .description("UX/UI ментор. Помогаю сделать интерфейс понятным и собрать портфолио.")
                        .telegram("maria_ux")
                        .email("maria.kim@example.com")
                        .skills(nonNullSkills(react, ux))
                        .build()
        ));

        log.info("Mentors initialized.");
    }

    private Skill findSkill(Set<Skill> skills, String name) {
        return skills.stream()
                .filter(skill -> name.equals(skill.getName()))
                .findFirst()
                .orElse(null);
    }

    private Set<Skill> nonNullSkills(Skill... skills) {
        Set<Skill> result = new HashSet<>();
        for (Skill skill : skills) {
            if (skill != null) {
                result.add(skill);
            }
        }
        return result;
    }
}
