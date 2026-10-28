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