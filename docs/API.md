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

DELETE /api/projects/{id}/members/{userId} — исключить участника из проекта (только владелец проекта).

GET /api/projects/{id}/workspace — получить рабочее пространство проекта (только владелец или участник).

GET /api/projects/{id}/messages — последние 100 сообщений общего чата проекта.

POST /api/projects/{id}/messages — отправить сообщение проекта (`{ "content": "..." }`).

Чтение и отправка доступны только владельцу и текущим участникам. Сообщения сохраняются после выхода или исключения автора; уведомления о сообщениях не создаются.

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

DELETE /api/chat/conversations/{id} — скрывает диалог только у текущего пользователя. Сообщения и история у собеседника сохраняются.