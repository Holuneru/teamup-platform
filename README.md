# TeamUp

TeamUp — веб-платформа для студентов, которые ищут команду для стартапов, хакатонов, учебных и исследовательских проектов.

## Текущие возможности

- JWT-регистрация и вход, профиль пользователя и загрузка аватара;
- навыки и поиск/фильтрация пользователей;
- проекты, участники, заявки и приглашения;
- рекомендации участников по требованиям проекта;
- каталог хакатонов с фильтрами;
- каталог наставников и их навыки;
- личные диалоги с непрочитанными сообщениями;
- рабочее пространство проекта: обзор, команда, общий чат с упоминаниями;
- Kanban-доска: задачи, исполнители, приоритеты, сроки, drag-and-drop, фильтры;
- комментарии к задачам и уведомления о назначениях, статусах, комментариях и упоминаниях.

## Стек

- **Backend:** Java 21, Spring Boot 3.5.16, Spring Security, Spring Data JPA, PostgreSQL, Flyway, JWT, Maven.
- **Frontend:** React 18, Vite, React Router, Axios, CSS.

## Настройка окружения

Для локальной разработки переменные окружения не нужны. `src/main/resources/application.yaml` уже содержит локальные значения:

- JDBC URL: `jdbc:postgresql://localhost:5432/` (база по умолчанию пользователя `postgres`);
- пользователь PostgreSQL: `postgres`;
- пароль PostgreSQL и JWT-секрет: локальные значения в `application.yaml`.

JWT-секрет должен быть не короче 32 байт. Эти значения предназначены только для локальной разработки. Перед публикацией репозитория или деплоем замените пароль и секрет и вынесите их из отслеживаемого файла.

Если нужно переопределить значения без изменения `application.yaml`, скопируйте `src/main/resources/application-local.yaml.example` в `src/main/resources/application-local.yaml`, заполните его и запустите с профилем `local`:

```powershell
$env:SPRING_PROFILES_ACTIVE="local"
```

`application-local.yaml` добавлен в `.gitignore`.

## Локальный запуск

Требуются JDK 21, PostgreSQL и Node.js, совместимый с версией Vite проекта.

1. Убедитесь, что PostgreSQL запущен и доступен с локальными параметрами из `application.yaml`. При необходимости измените их.
2. Запустите backend из корня:

   ```bash
   ./mvnw spring-boot:run
   ```

   В Windows: `mvnw.cmd spring-boot:run`.
3. Запустите frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend ожидает локальный адрес `http://localhost:5173`, если конфигурация не изменена.

## Проверки

```bash
./mvnw test
cd frontend
npm run build
npm run lint
```

Тесты backend используют H2 в режиме PostgreSQL и отключают Flyway через профиль `test`. Миграции в `src/main/resources/db/migration` рассчитаны на PostgreSQL.

## Документация

- [Обзор проекта и запуск](docs/README.md)
- [REST API](docs/API.md)
- [Схема базы данных](docs/DATABASE.md)
- [Правила разработки и Cursor](docs/PROJECT_RULES.md)
- [Roadmap](docs/ROADMAP.md)
- [Список задач](docs/TASKS.md)
