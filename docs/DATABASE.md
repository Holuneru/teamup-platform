

# !!ВАЖНО!!

В ходе разработки были добавленны 
новые таблицы которые 
тут не описанны


# DATABASE

## Общая информация

База данных PostgreSQL.

Используется Spring Data JPA.

Все таблицы создаются автоматически Hibernate.

---

# User

Хранит пользователей платформы.

| Поле | Тип | Описание |
|------|-----|----------|
| id | Long | Уникальный идентификатор |
| firstName | String | Имя |
| lastName | String | Фамилия |
| email | String | Email (логин) |
| password | String | Захешированный пароль |
| university | String | Университет |
| course | Integer | Курс |
| about | String | Краткая информация о пользователе |
| participationFormat | Enum | ONLINE / OFFLINE / BOTH |
| role | Enum | USER / MENTOR / ADMIN |
| telegram | String | Telegram для связи |
| github | String | GitHub (необязательно) |
| createdAt | LocalDateTime | Дата регистрации |

### Связи

- ManyToMany → Skill
- OneToMany → Project (как владелец)
- OneToMany → Application (как участник)


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
- ACCEPTED
- REJECTED
- REMOVED — участник был исключен владельцем; после этого можно подать новую заявку

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

---

# ProjectMessage

Сообщение общего чата проекта. История сохраняется, даже когда автор перестает быть участником.

| Поле | Тип | Описание |
|------|-----|----------|
| id | Long | Уникальный идентификатор |
| projectId | Long | Проект |
| senderId | Long | Автор сообщения |
| content | String | Текст сообщения, до 4000 символов |
| createdAt | LocalDateTime | Время отправки |

---

# ProjectTask

Карточка задачи общей доски проекта.

| Поле | Тип | Описание |
|------|-----|----------|
| id | Long | Уникальный идентификатор |
| projectId | Long | Проект |
| createdById | Long | Автор задачи |
| assigneeId | Long | Исполнитель, необязательно |
| title | String | Название, до 140 символов |
| description | String | Описание, до 2000 символов |
| status | Enum | TODO / IN_PROGRESS / REVIEW / DONE |
| priority | Enum | LOW / MEDIUM / HIGH |
| dueDate | LocalDate | Срок, необязательно |
| createdAt | LocalDateTime | Дата создания |

---

# ProjectTask

Карточка задачи общей доски проекта.

| Поле | Тип | Описание |
|------|-----|----------|
| id | Long | Уникальный идентификатор |
| projectId | Long | Проект |
| createdById | Long | Автор задачи |
| assigneeId | Long | Исполнитель, необязательно |
| title | String | Название, до 140 символов |
| description | String | Описание, до 2000 символов |
| status | Enum | TODO / IN_PROGRESS / REVIEW / DONE |
| priority | Enum | LOW / MEDIUM / HIGH |
| dueDate | LocalDate | Срок, необязательно |
| createdAt | LocalDateTime | Дата создания |