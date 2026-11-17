# REST API TeamUp

Базовый префикс: `/api`. Backend по умолчанию слушает `http://localhost:8080`.

## Аутентификация

Все маршруты, кроме `/api/auth/**` и `/uploads/**`, требуют заголовок:

```http
Authorization: Bearer <jwt>
```

JWT подписывается секретом `app.jwt.secret` из конфигурации backend и действует 24 часа.

### POST /api/auth/register

Создаёт пользователя. Ответ `201 Created`.

Тело запроса:

| Поле | Тип | Обязательно |
|---|---|---|
| `firstName` | string | да |
| `lastName` | string | да |
| `email` | string | да |
| `password` | string | да |
| `university` | string | нет |
| `course` | integer | нет |
| `about` | string | нет |
| `telegram` | string | нет |
| `github` | string | нет |
| `avatarUrl` | string | нет |

Ответ — `UserResponse`.

### POST /api/auth/login

Тело: `email`, `password`. Ответ — `LoginResponse` с JWT.

### POST /api/auth/logout

Ответ `204 No Content`. JWT хранится на клиенте, поэтому сервер только подтверждает выход.

---

## Пользователи и навыки

### GET /api/users

Список пользователей. Необязательные query-параметры: `university`, `skill`, `role`, `format`.

### GET /api/users/search?query=...

Поиск пользователей по строке.

### GET /api/users/{id}

Профиль пользователя по идентификатору.

### GET /api/users/me

Профиль текущего пользователя.

### PUT /api/users/me

Обновляет профиль текущего пользователя.

Тело: `firstName`, `lastName`, `university`, `course`, `about`, `telegram`, `github`, `lookingForTeam`, `participationFormat`.

### POST /api/users/me/avatar

Загружает аватар. `multipart/form-data`, поле `file`. Ответ — строка с URL аватара.

### PUT /api/users/{userId}/skills

Заменяет набор навыков пользователя. Тело: `{ "skillIds": [1, 2, 3] }`. Возвращает список `SkillResponse`.

### GET /api/skills

Список всех навыков.

### POST /api/skills

Создаёт навык. Тело: `{ "name": "Java" }`. Ответ `201 Created`.

---

## Проекты

### GET /api/projects

Список проектов. Необязательные query-параметры: `query`, `skill`.

### GET /api/projects/{id}

Карточка проекта.

### POST /api/projects

Создаёт проект. Ответ `201 Created`.

Тело: `title`, `description`, `requiredSkillIds`. Владельцем становится текущий пользователь; поле `ownerId` в запросе игнорируется.

### PUT /api/projects/{id}

Обновляет проект. Доступно владельцу.

### DELETE /api/projects/{id}

Удаляет проект вместе с участниками, сообщениями, задачами и комментариями задач. Доступно владельцу. Ответ `204 No Content`.

### GET /api/projects/my

Проекты, которыми владеет текущий пользователь.

### GET /api/projects/my/{userId}

Проекты указанного владельца.

### GET /api/projects/participating

Проекты, в которых текущий пользователь состоит участником.

### GET /api/projects/{id}/workspace

Данные рабочего пространства проекта. Доступно владельцу и текущим участникам.

### DELETE /api/projects/{id}/leave

Текущий пользователь покидает проект.

### DELETE /api/projects/{id}/members/{userId}

Исключает участника. Доступно владельцу проекта. Ответ `204 No Content`.

### GET /api/projects/{id}/members

Список участников проекта.

---

## Заявки

### POST /api/projects/{projectId}/apply

Подаёт заявку на участие от имени текущего пользователя. Тело необязательно; `userId` из тела игнорируется. Ответ `201 Created`. Владелец проекта и текущие участники не могут подать заявку.

### GET /api/projects/{projectId}/applications

Заявки проекта со статусом `PENDING`. Доступно владельцу.

### POST /api/projects/applications/{id}/accept

Принимает заявку. Пользователь становится участником, связанное ожидающее приглашение закрывается. Доступно владельцу проекта.

### POST /api/projects/applications/{id}/reject

Отклоняет заявку. Существующее членство не затрагивается. Доступно владельцу проекта.

### POST /api/applications/{id}/accept

Альтернативный маршрут принятия заявки.

### POST /api/applications/{id}/reject

Альтернативный маршрут отклонения заявки.

### PUT /api/applications/{id}?status=...

Совместимый маршрут смены статуса. `ACCEPTED`/`APPROVED` принимает заявку, остальные значения отклоняют.

### DELETE /api/applications/{id}

Удаляет заявку.

---

## Приглашения

### POST /api/invitations/project/{projectId}/user/{userId}

Приглашает пользователя в проект. Доступно владельцу проекта.

### GET /api/invitations/me

Приглашения текущего пользователя.

### POST /api/invitations/{id}/accept

Принимает приглашение. Создаёт членство, если его ещё нет, и закрывает связанную ожидающую заявку.

### POST /api/invitations/{id}/reject

Отклоняет приглашение.

### GET /api/invitations/status/user/{userId}

Возвращает список статусов приглашений указанного пользователя. Используется интерфейсом для отображения уже приглашённых людей.

---

## Рекомендации

### GET /api/recommendations/project/{projectId}

Рекомендованные участники для проекта. Учитываются требуемые навыки и статус `lookingForTeam`.

---

## Хакатоны

### GET /api/hackathons

Список хакатонов. Необязательные query-параметры: `format`, `from` (дата в формате ISO, например `2026-05-01`).

### GET /api/hackathons/{id}

Карточка хакатона.

### POST /api/hackathons

Создаёт хакатон. Тело: `title`, `description`, `deadline`, `location`, `format`, `prize`, `link`. Ответ `201 Created`.

### PUT /api/hackathons/{id}

Обновляет хакатон.

### DELETE /api/hackathons/{id}

Удаляет хакатон. Ответ `204 No Content`.

---

## Наставники

### GET /api/mentors

Список наставников.

### GET /api/mentors/{id}

Карточка наставника.

### POST /api/mentors

Создаёт наставника. Тело: `name`, `organization`, `description`, `telegram`, `email`, `skillIds`. Ответ `201 Created`.

### PUT /api/mentors/{id}

Обновляет наставника.

### DELETE /api/mentors/{id}

Удаляет наставника. Ответ `204 No Content`.

---

## Личный чат

### GET /api/chat/conversations

Диалоги текущего пользователя.

### POST /api/chat/conversations/with/{userId}

Открывает или создаёт диалог с пользователем.

### GET /api/chat/conversations/{id}/messages

Сообщения диалога. Доступно только участникам диалога.

### POST /api/chat/conversations/{id}/messages

Отправляет сообщение. Тело: `{ "content": "..." }`. Ответ `201 Created`.

### POST /api/chat/conversations/{id}/read

Отмечает сообщения диалога прочитанными. Ответ `204 No Content`.

### DELETE /api/chat/conversations/{id}

Скрывает диалог только у текущего пользователя. История у собеседника сохраняется. Ответ `204 No Content`.

### GET /api/chat/unread-count

Количество непрочитанных сообщений текущего пользователя.

---

## Общий чат проекта

### GET /api/projects/{projectId}/messages

Последние 100 сообщений общего чата. Доступно владельцу и текущим участникам.

### POST /api/projects/{projectId}/messages

Отправляет сообщение. Ответ `201 Created`.

Тело:

```json
{
  "content": "Текст сообщения",
  "mentionedUserIds": [3, 7]
}
```

`mentionedUserIds` необязателен. Упоминание создаёт уведомление только указанным текущим участникам проекта. Обычное сообщение без упоминаний уведомлений не создаёт. История сохраняется после выхода или исключения автора.

---

## Задачи и комментарии

Маршруты задач доступны владельцу и текущим участникам проекта.

### GET /api/projects/{projectId}/tasks

Доска задач проекта.

### POST /api/projects/{projectId}/tasks

Создаёт задачу. Ответ `201 Created`.

Тело: `title`, `description`, `assigneeId`, `priority`, `dueDate`.

### PUT /api/projects/{projectId}/tasks/{taskId}

Обновляет задачу: название, описание, исполнитель, приоритет, срок.

### PATCH /api/projects/{projectId}/tasks/{taskId}/status

Меняет статус. Тело: `{ "status": "IN_PROGRESS" }`.

### DELETE /api/projects/{projectId}/tasks/{taskId}

Удаляет задачу вместе с комментариями. Доступно автору задачи или владельцу проекта. Ответ `204 No Content`.

### GET /api/projects/{projectId}/tasks/{taskId}/comments

Комментарии задачи в порядке создания.

### POST /api/projects/{projectId}/tasks/{taskId}/comments

Добавляет комментарий. Тело: `{ "content": "..." }`. Ответ `201 Created`.

---

## Уведомления

### GET /api/notifications

Уведомления текущего пользователя.

### GET /api/notifications/unread-count

Количество непрочитанных уведомлений.

### POST /api/notifications/{id}/read

Отмечает уведомление прочитанным. Ответ `204 No Content`.

### POST /api/notifications/read-all

Отмечает все уведомления прочитанными. Ответ `204 No Content`.

---

## Формат ошибок

Ошибки возвращаются в едином виде:

```json
{
  "timestamp": "2026-05-01T12:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Текст ошибки",
  "path": "/api/projects/1"
}
```

Основные коды: `400` — некорректный запрос, `401` — неверные credentials, `403` — нет прав, `404` — ресурс не найден, `409` — конфликт (например, email уже занят).
