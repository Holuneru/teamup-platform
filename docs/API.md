# REST API

## Авторизация

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

---

## Пользователь

GET /api/users/me

PUT /api/users/me

GET /api/users

GET /api/users/{id}

---

## Навыки

GET /api/skills

POST /api/skills

---

## Проекты

GET /api/projects

GET /api/projects/{id}

POST /api/projects

PUT /api/projects/{id}

DELETE /api/projects/{id}

---

## Заявки

POST /api/projects/{id}/apply

PUT /api/applications/{id}

DELETE /api/applications/{id}

---

## Хакатоны

GET /api/hackathons

GET /api/hackathons/{id}

POST /api/hackathons

PUT /api/hackathons/{id}

DELETE /api/hackathons/{id}

---

## Наставники

GET /api/mentors

GET /api/mentors/{id}

POST /api/mentors

PUT /api/mentors/{id}

DELETE /api/mentors/{id}

---

## Чат

Все запросы требуют JWT.

GET /api/chat/conversations — список диалогов текущего пользователя.

POST /api/chat/conversations/with/{userId} — открыть или создать личный диалог.

GET /api/chat/conversations/{id}/messages — последние 100 сообщений диалога.

POST /api/chat/conversations/{id}/messages — отправить сообщение (`{ "content": "..." }`).

POST /api/chat/conversations/{id}/read — отметить входящие сообщения диалога прочитанными.

GET /api/chat/unread-count — число непрочитанных входящих сообщений.

Доступ к сообщениям есть только у двух участников диалога. MVP обновляет переписку периодическим REST-опросом.

---

## Уведомления

GET /api/notifications — последние 100 уведомлений текущего пользователя.

GET /api/notifications/unread-count — число непрочитанных уведомлений.

POST /api/notifications/{id}/read — отметить уведомление прочитанным.

POST /api/notifications/read-all — отметить все уведомления прочитанными.

Уведомления создаются для новых сообщений, приглашений в проект и событий по заявкам/приглашениям.