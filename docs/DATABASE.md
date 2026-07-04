# DATABASE

## Общая информация

База данных PostgreSQL.

Используется Spring Data JPA.

Все таблицы создаются автоматически Hibernate.

---

# User

Хранит пользователей платформы.

| Поле | Тип |
|------|-----|
| id | Long |
| name | String |
| email | String |
| password | String |
| university | String |
| course | Integer |
| about | String |
| participationFormat | Enum |
| role | Enum |
| createdAt | LocalDateTime |

Связи

ManyToMany -> Skill

OneToMany -> Project

OneToMany -> Application

---

# Skill

Навыки пользователя.

Например

- Java
- Python
- Design
- Marketing
- ML
- Physics

| Поле | Тип |
|------|-----|
| id | Long |
| name | String |

---

# Project

Стартап или идея.

| Поле | Тип |
|------|-----|
| id | Long |
| title | String |
| description | Text |
| owner | User |
| createdAt | LocalDateTime |

Связи

ManyToOne -> User

ManyToMany -> Skill

OneToMany -> Application

---

# Application

Заявка пользователя в проект.

| Поле | Тип |
|------|-----|
| id | Long |
| project | Project |
| applicant | User |
| status | Enum |

Status

- PENDING
- APPROVED
- DECLINED

---

# Hackathon

| Поле | Тип |
|------|-----|
| id | Long |
| title | String |
| description | Text |
| deadline | LocalDate |
| location | String |
| format | Enum |
| prize | String |
| registrationUrl | String |

---

# Mentor

| Поле | Тип |
|------|-----|
| id | Long |
| name | String |
| organization | String |
| about | Text |
| telegram | String |
| email | String |

ManyToMany -> Skill