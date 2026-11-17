# База данных TeamUp

## Общая информация

- СУБД: **PostgreSQL**.
- Доступ к данным: **Spring Data JPA / Hibernate**.
- Миграции: **Flyway**, файлы в `src/main/resources/db/migration`.
- Основной профиль использует `spring.jpa.hibernate.ddl-auto: update`, поэтому Hibernate может дополнять схему. Flyway при этом также применяет SQL-миграции при старте.
- Тесты используют профиль `test`: H2 в режиме PostgreSQL, `ddl-auto: create-drop`, Flyway отключён.

Историческая особенность: миграции `V1`–`V5` добавляют объекты к схеме, созданной Hibernate. Полная схема «с нуля» только миграциями пока не описывается. При изменении сущностей нужно проверять и JPA-модель, и миграции.

## Сущности и таблицы

| Сущность | Таблица | Назначение |
|---|---|---|
| `User` | `users` | Пользователи платформы |
| `Skill` | `skills` | Навыки |
| `Project` | `projects` | Проекты |
| `ProjectMember` | `project_members` | Членство в проекте |
| `ProjectApplication` | `project_applications` | Заявки на участие |
| `ProjectInvitation` | `project_invitations` | Приглашения в проект |
| `ProjectMessage` | `project_messages` | Общий чат проекта |
| `ProjectTask` | `project_tasks` | Задачи Kanban-доски |
| `TaskComment` | `task_comments` | Комментарии к задачам |
| `Conversation` | `conversations` | Личные диалоги |
| `ChatMessage` | `chat_messages` | Сообщения личных диалогов |
| `UserNotification` | `user_notifications` | Уведомления |
| `Hackathon` | `hackathons` | Каталог хакатонов |
| `Mentor` | `mentors` | Каталог наставников |

Связующие таблицы:

- `user_skills` — `User` ↔ `Skill`;
- `project_members` — отдельная сущность членства (scalar `projectId`/`userId`);
- `project_required_skills` — `Project` ↔ `Skill` (генерируется Hibernate для `requiredSkills`);
- `mentor_skills` — `Mentor` ↔ `Skill`.

---

## users

| Поле | Тип | Ограничения | Описание |
|---|---|---|---|
| `id` | Long | PK, identity | Идентификатор |
| `first_name` | String | NOT NULL | Имя |
| `last_name` | String | NOT NULL | Фамилия |
| `email` | String | NOT NULL, UNIQUE | Логин |
| `password` | String | NOT NULL | BCrypt-хеш |
| `university` | String | | Университет |
| `course` | Integer | | Курс |
| `about` | String(1000) | | Описание профиля |
| `telegram` | String | | Telegram |
| `github` | String | | GitHub |
| `avatar_url` | String | | URL аватара |
| `participation_format` | Enum | | `ONLINE` / `OFFLINE` / `BOTH` |
| `role` | Enum | | `USER` / `MENTOR` / `ADMIN` |
| `created_at` | LocalDateTime | NOT NULL, updatable=false | Дата регистрации |
| `looking_for_team` | Boolean | NOT NULL, default true | Ищет команду |

Связи:

- ManyToMany → `Skill` через `user_skills`;
- OneToMany → `Project` как владелец (`projects.owner_id`);
- ManyToMany → `Project` как участник (`project_members` — отдельная сущность).

---

## skills

| Поле | Тип | Ограничения |
|---|---|---|
| `id` | Long | PK, identity |
| `name` | String | NOT NULL, UNIQUE |

---

## projects

| Поле | Тип | Ограничения | Описание |
|---|---|---|---|
| `id` | Long | PK, identity | Идентификатор |
| `title` | String | | Название |
| `description` | String(2000) | | Описание |
| `owner_id` | Long | FK → `users.id` | Владелец |
| `created_at` | LocalDateTime | | Дата создания |

Связи:

- ManyToOne → `User` (`owner`);
- ManyToMany → `User` (`members`, историческая модель членства);
- ManyToMany → `Skill` (`requiredSkills`).

> В проекте сосуществуют две модели членства: `Project.members` и `ProjectMember`. Сервисы в основном используют `ProjectMember`; `Project.members` остаётся в сущности и должен учитываться при изменениях.

---

## project_members

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `project_id` | Long | Идентификатор проекта |
| `user_id` | Long | Идентификатор пользователя |
| `role` | String | `OWNER` / `MEMBER` |
| `joined_at` | LocalDateTime | Дата вступления |

Уникальное ограничение на пару `project_id` + `user_id` в JPA-модели не объявлено; дубли предотвращаются проверками в сервисах.

---

## project_applications

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `project_id` | Long | Проект |
| `user_id` | Long | Заявитель |
| `status` | Enum | `PENDING` / `ACCEPTED` / `REJECTED` / `REMOVED` |
| `created_at` | LocalDateTime | Дата подачи |

`REMOVED` означает, что участник был исключён; после этого можно подать новую заявку.

---

## project_invitations

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `project_id` | Long | Проект |
| `user_id` | Long | Приглашённый пользователь |
| `status` | Enum | `PENDING` / `ACCEPTED` / `REJECTED` |
| `created_at` | LocalDateTime | Дата приглашения |

При принятии приглашения создаётся `project_members`, если членства ещё нет, и закрывается связанная ожидающая заявка.

---

## project_messages

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `project_id` | Long | Проект |
| `sender_id` | Long | Автор |
| `content` | String(4000) | Текст |
| `created_at` | LocalDateTime | Время отправки |

Индекс: `(project_id, id)`. История сохраняется после выхода или исключения автора.

---

## project_tasks

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `project_id` | Long | Проект |
| `created_by_id` | Long | Автор задачи |
| `assignee_id` | Long | Исполнитель, необязательно |
| `title` | String(140) | Название |
| `description` | String(2000) | Описание |
| `status` | Enum | `TODO` / `IN_PROGRESS` / `REVIEW` / `DONE` |
| `priority` | Enum | `LOW` / `MEDIUM` / `HIGH` |
| `due_date` | LocalDate | Срок, необязательно |
| `created_at` | LocalDateTime | Дата создания |

Индекс: `(project_id, status)`. При удалении задачи удаляются её комментарии; при удалении проекта — задачи и комментарии проекта.

---

## task_comments

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `project_id` | Long | Проект |
| `task_id` | Long | Задача |
| `author_id` | Long | Автор комментария |
| `content` | String(2000) | Текст |
| `created_at` | LocalDateTime | Время создания |

Индексы: `task_id`, `project_id`.

---

## conversations

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `participant_one_id` | Long | Первый участник |
| `participant_two_id` | Long | Второй участник |
| `last_message_at` | LocalDateTime | Время последнего сообщения |
| `participant_one_deleted_at` | LocalDateTime | Скрытие диалога первым участником |
| `participant_two_deleted_at` | LocalDateTime | Скрытие диалога вторым участником |

Уникальное ограничение: `(participant_one_id, participant_two_id)`.

---

## chat_messages

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `conversation_id` | Long | Диалог |
| `sender_id` | Long | Отправитель |
| `content` | String(4000) | Текст |
| `created_at` | LocalDateTime | Время отправки |
| `read_at` | LocalDateTime | Время прочтения |

Индекс: `(conversation_id, created_at)`.

---

## user_notifications

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `recipient_id` | Long | Получатель |
| `actor_id` | Long | Инициатор события, необязательно |
| `type` | Enum | Тип уведомления |
| `title` | String(160) | Заголовок |
| `body` | String(500) | Текст |
| `target_url` | String(300) | Ссылка перехода |
| `created_at` | LocalDateTime | Дата создания |
| `read_at` | LocalDateTime | Дата прочтения |

Индекс: `(recipient_id, created_at)`.

Типы:

- `NEW_MESSAGE`
- `PROJECT_INVITATION`
- `INVITATION_ACCEPTED`
- `INVITATION_REJECTED`
- `APPLICATION_RECEIVED`
- `APPLICATION_ACCEPTED`
- `APPLICATION_REJECTED`
- `PROJECT_MENTION`
- `TASK_ASSIGNED`
- `TASK_COMMENT`
- `TASK_STATUS_CHANGED`

Обычные сообщения в личном и проектном чате уведомлений не создают. Уведомление появляется при упоминании `@` в общем чате проекта и при событиях задач.

---

## hackathons

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `title` | String | Название |
| `description` | String(4000) | Описание |
| `deadline` | LocalDate | Дедлайн |
| `location` | String | Место |
| `format` | Enum | `ONLINE` / `OFFLINE` / `HYBRID` |
| `prize` | String | Приз |
| `link` | String | Ссылка на регистрацию |

---

## mentors

| Поле | Тип | Описание |
|---|---|---|
| `id` | Long | PK, identity |
| `name` | String | Имя |
| `organization` | String | Организация |
| `description` | String(2000) | Описание |
| `telegram` | String | Telegram |
| `email` | String | Email |

Связи: ManyToMany → `Skill` через `mentor_skills`.

---

## Миграции

| Версия | Файл | Назначение |
|---|---|---|
| V1 | `add_users_created_at.sql` | `users.created_at` |
| V2 | `add_per_user_conversation_visibility.sql` | Скрытие диалога отдельно для каждого участника |
| V3 | `allow_removed_application_status.sql` | Статус заявки `REMOVED` |
| V4 | `create_project_messages.sql` | Таблица сообщений проекта |
| V5 | `create_project_tasks.sql` | Таблица задач проекта |
| V6 | `extend_notification_types.sql` | Расширение типов уведомлений |
| V7 | `add_task_event_notification_types.sql` | Повторно задаёт тот же CHECK-набор типов |

`V6` и `V7` содержат одинаковый CHECK-набор; `V7` не добавляет новых значений. Файл `V1` использует PostgreSQL-блок `DO $$` и несовместим с H2, поэтому в тестах Flyway отключён.

При добавлении миграций:

- не изменяйте уже применённые файлы — создавайте новую версию;
- проверяйте совместимость с PostgreSQL;
- тесты выполняются на H2, поэтому PostgreSQL-специфичный SQL в тестах не проверяется автоматически.
