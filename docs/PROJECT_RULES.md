# TeamUp (рабочее название)

## Описание проекта

TeamUp — веб-платформа для студентов, предназначенная для поиска команды, участия в стартапах, поиска хакатонов и взаимодействия с наставниками.

Проект является MVP и должен быть максимально простым, но полностью рабочим.

Главный принцип проекта:

> Минимум функциональности — максимум качества реализации.

Не использовать лишние технологии.

---

# Стек проекта

Backend

- Java 21
- Spring Boot 3
- Maven
- Spring Web
- Spring Data JPA
- Spring Security
- Validation
- Lombok
- PostgreSQL

Frontend

- HTML
- CSS
- Vanilla JavaScript

Использовать существующий prototype.html как основу интерфейса.

Допускается разбить его на отдельные страницы.

---

# Архитектура

Использовать классическую архитектуру Spring Boot.

Controller

↓

Service

↓

Repository

↓

PostgreSQL

Никакой бизнес-логики в контроллерах.

Все проверки находятся в Service.

---

# Структура проекта

src/main/java

```
com.teamup

    config

    security

    controller

    dto

    entity

    mapper

    repository

    service

    exception

    util
```

---

# DTO использовать обязательно

Никогда не возвращать Entity наружу.

Использовать

RegisterRequest

LoginRequest

UserResponse

ProjectResponse

HackathonResponse

MentorResponse

ApplicationResponse

---

# Mapper

Использовать отдельные Mapper классы.

Не писать преобразования вручную внутри контроллеров.

---

# Entity

## User

Поля

```
id

name

email

password

university

course

about

role

onlineFormat

createdAt
```

---

## Skill

```
id

name
```

---

User ↔ Skill

ManyToMany

---

## Project

```
id

title

description

owner

requiredSkills

membersCount

createdAt
```

Owner

ManyToOne(User)

---

## ProjectApplication

```
id

project

user

status

createdAt
```

Status

```
PENDING

APPROVED

DECLINED
```

---

## Hackathon

```
id

title

description

deadline

location

format

prize

link
```

---

## Mentor

```
id

name

organization

description

skills

telegram

email
```

---

# Роли пользователей

Использовать Enum

```
USER

MENTOR

ADMIN
```

Spring Security должен использовать роли.

---

# Регистрация

POST

/api/auth/register

При регистрации необходимо

- проверить email

- проверить уникальность

- захешировать пароль BCrypt

- создать пользователя

Ответ

201 Created

---

# Авторизация

POST

/api/auth/login

Для MVP достаточно Session Authentication.

JWT использовать НЕ обязательно.

---

# Профиль

Пользователь может

получить

```
GET /api/users/me
```

обновить

```
PUT /api/users/me
```

изменить навыки

изменить описание

изменить университет

изменить курс

---

# Пользователи

```
GET /api/users
```

Фильтрация

по университету

по навыкам

по роли

по формату участия

---

Карточка пользователя должна содержать

Имя

Университет

Навыки

Описание

Кнопку

Связаться

---

# Проекты

Любой зарегистрированный пользователь может создать проект.

CRUD

```
GET /api/projects

GET /api/projects/{id}

POST /api/projects

PUT /api/projects/{id}

DELETE /api/projects/{id}
```

---

# Заявки

```
POST

/api/projects/{id}/apply
```

Создает заявку.

Владелец проекта может

принять

или

отклонить.

---

# Хакатоны

Полный CRUD.

На главной отображаются последние.

Поддерживать фильтрацию

по

онлайн

оффлайн

дате

---

# Наставники

CRUD.

Карточка содержит

имя

организацию

компетенции

описание

контакты

---

# Главная страница

После входа пользователь видит

поиск команды

хакатоны

стартапы

менторы

статистику

---

# Frontend

Использовать Fetch API.

Никаких JQuery.

Все запросы идут через REST.

---

Пример

```javascript
fetch("/api/projects")
```

---

# Валидация

Использовать Jakarta Validation.

Например

```
@NotBlank

@Email

@Size

@NotNull
```

---

# Исключения

Создать GlobalExceptionHandler.

Использовать

```
@ResponseStatus
```

или

```
@RestControllerAdvice
```

---

# Ответы API

Использовать правильные HTTP коды

200

201

204

400

401

403

404

500

---

# База данных

Использовать PostgreSQL.

Hibernate самостоятельно создает таблицы.

```
spring.jpa.hibernate.ddl-auto=update
```

---

# Безопасность

Пароли

BCrypt

Закрыть

POST

PUT

DELETE

для неавторизованных пользователей.

---

# Логирование

Использовать Slf4j.

Не использовать System.out.println().

---

# Код

Использовать

Constructor Injection.

Никаких Field Injection.

Использовать Lombok

```
@RequiredArgsConstructor
```

---

# Не использовать

Не использовать микросервисы.

Не использовать Docker.

Не использовать Kafka.

Не использовать Redis.

Не использовать RabbitMQ.

Не использовать GraphQL.

Не использовать SOAP.

Не использовать WebSocket.

Не использовать OAuth.

Не использовать сложные паттерны.

---

# Что должно работать

✅ Регистрация

✅ Вход

✅ Выход

✅ Профиль

✅ Редактирование профиля

✅ Просмотр пользователей

✅ Поиск пользователей

✅ Создание проекта

✅ Просмотр проектов

✅ Отклик на проект

✅ Просмотр хакатонов

✅ Просмотр наставников

---

# MVP

После запуска приложения преподаватель должен иметь возможность

1.

Зарегистрироваться

↓

2.

Войти

↓

3.

Заполнить профиль

↓

4.

Добавить навыки

↓

5.

Создать проект

↓

6.

Посмотреть других пользователей

↓

7.

Подать заявку в чужой проект

↓

8.

Посмотреть хакатоны

↓

9.

Посмотреть наставников

Все данные должны храниться в PostgreSQL.

---

# Требования к Cursor

При генерации кода придерживаться следующих правил:

- соблюдать архитектуру Controller → Service → Repository;
- использовать DTO для всех запросов и ответов;
- не возвращать Entity напрямую;
- писать чистый и читаемый код;
- добавлять комментарии только там, где логика неочевидна;
- придерживаться единого стиля именования;
- не создавать лишние классы и абстракции;
- перед добавлением новой функциональности использовать существующую структуру проекта;
- писать код так, чтобы проект можно было показать как законченный MVP.