# Модель базы данных TeamUp

Документ основан на JPA-сущностях в `src/main/java/com/teamup/entity`. Это описание модели, а не выгрузка фактической схемы PostgreSQL: реальные имена join-таблиц/колонок могут зависеть от naming strategy Hibernate и настроек приложения.

## Общая информация

- СУБД: PostgreSQL.
- Доступ к данным: Spring Data JPA / Hibernate.
- Первичные ключи сущностей — `Long`, генерируются через `GenerationType.IDENTITY`.
- Enum-поля хранятся как строки там, где указано `@Enumerated(EnumType.STRING)`.
- Конфигурация Hibernate может обновлять схему автоматически; для production следует использовать управляемые миграции и не полагаться на автоматическое изменение схемы.

## Сущности

### `users` — User

| Поле | Тип Java | Ограничения / назначение |
|---|---|---|
| id | Long | PK, identity |
| firstName | String | NOT NULL |
| lastName | String | NOT NULL |
| email | String | NOT NULL, UNIQUE; логин |
| password | String | NOT NULL; хранится хеш пароля |
| university | String | Университет |
| course | Integer | Курс |
| about | String | До 1000 символов |
| telegram | String | Контакт |
| github | String | Ссылка/имя GitHub |
| avatarUrl | String | URL/путь аватара |
| participationFormat | ParticipationFormat | ONLINE / OFFLINE / BOTH; по умолчанию BOTH при создании |
| role | Role | USER / MENTOR / ADMIN; по умолчанию USER |
| createdAt | LocalDateTime | NOT NULL, устанавливается при создании |
| lookingForTeam | Boolean | NOT NULL, по умолчанию true |

Связь с навыками — Many-to-Many через `user_skills(user_id, skill_id)`.

### `skills` — Skill

| Поле | Тип Java | Ограничения / назначение |
|---|---|---|
| id | Long | PK, identity |
| name | String | NOT NULL, UNIQUE |

Обратная сторона Many-to-Many с пользователями; `users` коллекция не является отдельной сущностью.

### `projects` — Project

| Поле | Тип Java | Назначение |
|---|---|---|
| id | Long | PK, identity |
| title | String | Название |
| description | String | До 2000 символов |
| owner | User | Many-to-One; владелец |
| members | Set<User> | Many-to-Many; участники |
| requiredSkills | Set<Skill> | Many-to-Many; необходимые навыки |
| createdAt | LocalDateTime | Устанавливается перед сохранением |

Для `members` и `requiredSkills` JPA создаёт join-таблицы по настройкам Hibernate. Их явные имена в сущности не заданы.

### `project_applications` — ProjectApplication

| Поле | Тип Java | Назначение |
|---|---|---|
| id | Long | PK, identity |
| projectId | Long | ID проекта |
| userId | Long | ID заявителя |
| status | ApplicationStatus | PENDING / ACCEPTED / REJECTED; по умолчанию PENDING |
| createdAt | LocalDateTime | NOT NULL, устанавливается при создании |

В этой сущности хранятся скалярные ID, а не JPA-связи на `Project` и `User`.

### `project_invitations` — ProjectInvitation

| Поле | Тип Java | Назначение |
|---|---|---|
| id | Long | PK, identity |
| projectId | Long | ID проекта |
| userId | Long | ID приглашённого пользователя |
| status | InvitationStatus | По умолчанию PENDING |
| createdAt | LocalDateTime | NOT NULL, устанавливается при создании |

ID проекта и пользователя хранятся как обычные поля, без JPA-ассоциаций в этой сущности.

### `project_members` — ProjectMember

| Поле | Тип Java | Назначение |
|---|---|---|
| id | Long | PK, identity |
| projectId | Long | ID проекта |
| userId | Long | ID участника |
| role | String | Комментарий в коде указывает OWNER / MEMBER |
| joinedAt | LocalDateTime | Устанавливается при создании |

Это отдельная сущность учёта членства; она существует наряду с Many-to-Many `Project.members`. Перед изменением модели следует проверить, как оба механизма используются сервисами, чтобы не рассинхронизировать данные.

### `hackathons` — Hackathon

| Поле | Тип Java | Назначение |
|---|---|---|
| id | Long | PK, identity |
| title | String | NOT NULL |
| description | String | До 4000 символов |
| deadline | LocalDate | Дедлайн |
| location | String | Место проведения |
| format | HackathonFormat | Enum, хранится строкой |
| prize | String | Приз |
| link | String | Ссылка на регистрацию/страницу |

### `mentors` — Mentor

| Поле | Тип Java | Назначение |
|---|---|---|
| id | Long | PK, identity |
| name | String | NOT NULL |
| organization | String | Организация |
| description | String | До 2000 символов |
| telegram | String | Контакт |
| email | String | Email |

Навыки наставника связаны Many-to-Many через `mentor_skills(mentor_id, skill_id)`.

## Enum-типы

- `Role`: USER, MENTOR, ADMIN.
- `ParticipationFormat`: ONLINE, OFFLINE, BOTH.
- `ApplicationStatus`: PENDING, ACCEPTED, REJECTED.
- `InvitationStatus`: см. `com.teamup.enums.InvitationStatus`.
- `HackathonFormat`: см. `com.teamup.enums.HackathonFormat`.

## Основные связи

```text
User --< user_skills >-- Skill
User --owns--> Project
Project --< members >-- User
Project --< requiredSkills >-- Skill
ProjectApplication -- projectId/userId --> Project/User (scalar IDs)
ProjectInvitation -- projectId/userId --> Project/User (scalar IDs)
ProjectMember -- projectId/userId --> Project/User (scalar IDs)
Mentor --< mentor_skills >-- Skill
```

## Замечания по целостности

1. У `ProjectApplication`, `ProjectInvitation` и `ProjectMember` идентификаторы связей хранятся как обычные числа. Наличие FK-ограничений из этих полей не следует автоматически из кода сущностей.
2. `Project.members` и `ProjectMember` представляют членство разными способами. Требуется проверка сервисов и данных, прежде чем удалять или объединять один из механизмов.
3. Текущие JPA-сущности не заменяют миграции схемы. Перед production-развёртыванием следует добавить версионируемые миграции и проверить ограничения на уникальность/целостность.
