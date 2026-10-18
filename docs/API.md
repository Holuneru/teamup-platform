# REST API TeamUp

Документ составлен по mapping-аннотациям контроллеров в `src/main/java/com/teamup/controller`. Он фиксирует существующие маршруты, а не гарантирует корректность всех сценариев. Для точных схем DTO см. классы в `com.teamup.dto`.

## Общие правила

- API использует префикс `/api`.
- Для защищённых запросов передавайте `Authorization: Bearer <JWT>`.
- В `SecurityConfig` публичными объявлены маршруты `/api/auth/**` и `/uploads/**`; остальные маршруты требуют аутентификации.
- Для локального frontend настроен CORS origin `http://localhost:5173`.
- В приложении используется JWT и stateless session policy.
- Детальные проверки владения ресурсом/ролей необходимо проверять для каждого действия отдельно. Не делайте вывод о правах только по HTTP-методу или наличию токена.

## Авторизация — `/api/auth`

| Метод | Маршрут | Назначение | Успешный ответ |
|---|---|---|---|
| POST | `/api/auth/register` | Регистрация | `201 Created`, `UserResponse` |
| POST | `/api/auth/login` | Вход | `200 OK`, `LoginResponse` (включает данные для авторизации) |
| POST | `/api/auth/logout` | Выход на стороне клиента | `204 No Content` |

JWT хранится на клиенте; текущий logout endpoint не отзывает токен на сервере.

## Пользователи — `/api/users`

| Метод | Маршрут | Параметры | Назначение |
|---|---|---|---|
| GET | `/api/users` | Необязательные `university`, `skill`, `role`, `format` | Список пользователей с фильтрами |
| GET | `/api/users/search` | Обязательный `query` | Поиск пользователей |
| GET | `/api/users/{id}` | Path: `id` | Профиль пользователя |
| GET | `/api/users/me` | Заголовок Authorization | Профиль текущего пользователя |
| PUT | `/api/users/me` | Заголовок Authorization, JSON `UpdateUserRequest` | Обновить профиль |
| PUT | `/api/users/{userId}/skills` | Path: `userId`, JSON `UpdateSkillsRequest` | Обновить набор навыков пользователя |
| POST | `/api/users/me/avatar` | Multipart-поле `file`, заголовок Authorization | Загрузить аватар; возвращается строка с результатом/URL |

Для `role` используются значения enum `USER`, `MENTOR`, `ADMIN`; для `format` — `ONLINE`, `OFFLINE`, `BOTH`.

## Навыки — `/api/skills`

| Метод | Маршрут | Назначение |
|---|---|---|
| GET | `/api/skills` | Получить каталог навыков |
| POST | `/api/skills` | Создать навык; JSON `CreateSkillRequest`, успешный ответ `201 Created` |

Обновление навыков пользователя находится в `PUT /api/users/{userId}/skills`, а не в контроллере `/api/skills`.

## Проекты — `/api/projects`

| Метод | Маршрут | Параметры | Назначение |
|---|---|---|---|
| GET | `/api/projects` | Необязательные `query`, `skill` | Список/поиск проектов |
| POST | `/api/projects` | JSON `CreateProjectRequest` | Создать проект; `201 Created` |
| GET | `/api/projects/{id}` | Path: `id` | Детали проекта |
| PUT | `/api/projects/{id}` | Path: `id`, JSON `CreateProjectRequest` | Обновить проект |
| DELETE | `/api/projects/{id}` | Path: `id` | Удалить проект; `204 No Content` |
| GET | `/api/projects/my` | — | Проекты текущего пользователя |
| GET | `/api/projects/my/{userId}` | Path: `userId` | Проекты указанного владельца |
| GET | `/api/projects/participating` | — | Проекты, в которых участвует текущий пользователь |
| DELETE | `/api/projects/{id}/leave` | Path: `id` | Выйти из проекта |
| GET | `/api/projects/{projectId}/members` | Path: `projectId` | Список участников проекта |

## Заявки на участие

Заявки обрабатываются двумя группами маршрутов.

### Через `/api/projects`

| Метод | Маршрут | Назначение |
|---|---|---|
| POST | `/api/projects/{projectId}/apply` | Подать заявку; тело запроса необязательно; `201 Created` |
| GET | `/api/projects/{projectId}/applications` | Список заявок проекта |
| POST | `/api/projects/applications/{id}/accept` | Принять заявку |
| POST | `/api/projects/applications/{id}/reject` | Отклонить заявку |

### Через `/api/applications`

| Метод | Маршрут | Назначение |
|---|---|---|
| POST | `/api/applications/{id}/accept` | Принять заявку |
| POST | `/api/applications/{id}/reject` | Отклонить заявку |
| PUT | `/api/applications/{id}?status=APPROVED` | Совместимый endpoint смены статуса: `APPROVED`/`ACCEPTED` ведёт к принятию, остальные значения — к отклонению |
| DELETE | `/api/applications/{id}` | Удалить заявку; `204 No Content` |

В модели `ApplicationStatus` используются значения `PENDING`, `ACCEPTED`, `REJECTED`. В legacy endpoint параметр `status` не валидируется как enum: любые значения, кроме `APPROVED` и `ACCEPTED`, ведут к отклонению.

## Приглашения — `/api/invitations`

| Метод | Маршрут | Назначение |
|---|---|---|
| POST | `/api/invitations/project/{projectId}/user/{userId}` | Пригласить пользователя в проект |
| GET | `/api/invitations/me` | Получить приглашения текущего пользователя |
| POST | `/api/invitations/{id}/accept` | Принять приглашение |
| POST | `/api/invitations/{id}/reject` | Отклонить приглашение |
| GET | `/api/invitations/status/user/{userId}` | Получить статусы приглашений указанного пользователя |

Статусы приглашения определяются enum `InvitationStatus`; точные значения см. в `com.teamup.enums.InvitationStatus`.

## Рекомендации — `/api/recommendations`

| Метод | Маршрут | Назначение |
|---|---|---|
| GET | `/api/recommendations/project/{projectId}` | Рекомендованные пользователи для проекта |

Алгоритм использует соответствие навыков требованиям проекта и статус `lookingForTeam`; точная формула оценки реализована в `RecommendationService`.

## Хакатоны — `/api/hackathons`

| Метод | Маршрут | Параметры | Назначение |
|---|---|---|---|
| GET | `/api/hackathons` | Необязательные `format`, `from` (дата ISO, например `2026-10-01`) | Список с фильтрами |
| GET | `/api/hackathons/{id}` | Path: `id` | Детали хакатона |
| POST | `/api/hackathons` | JSON `CreateHackathonRequest` | Создать; `201 Created` |
| PUT | `/api/hackathons/{id}` | JSON `CreateHackathonRequest` | Обновить |
| DELETE | `/api/hackathons/{id}` | Path: `id` | Удалить; `204 No Content` |

Формат хакатона — enum `HackathonFormat`; список значений см. в исходном enum.

## Наставники — `/api/mentors`

| Метод | Маршрут | Назначение |
|---|---|---|
| GET | `/api/mentors` | Каталог наставников |
| GET | `/api/mentors/{id}` | Детали наставника |
| POST | `/api/mentors` | Создать наставника; JSON `CreateMentorRequest`, `201 Created` |
| PUT | `/api/mentors/{id}` | Обновить наставника |
| DELETE | `/api/mentors/{id}` | Удалить наставника; `204 No Content` |

## Ошибки и тестирование

Ожидаемые HTTP-коды зависят от обработчиков исключений и конкретной операции: обычно используются `200`, `201`, `204`, `400`, `401`, `403` и `404`. Не все случаи описаны централизованным контрактом; перед фиксацией стабильного API-контракта следует добавить тесты контроллеров.

Пример запроса после входа:

```http
GET /api/users/me
Authorization: Bearer <JWT>
```

Схемы полей JSON нужно сверять с соответствующими DTO в `src/main/java/com/teamup/dto/request` и `dto/response`.
