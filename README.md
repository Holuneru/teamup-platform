# TeamUp

TeamUp — веб-платформа для студентов, которые ищут команду для стартапов, хакатонов, учебных и исследовательских проектов.

## Текущие возможности

- JWT-регистрация и вход, профиль пользователя и загрузка аватара;
- навыки и поиск/фильтрация пользователей;
- проекты, участники, заявки и приглашения;
- рекомендации участников по требованиям проекта;
- каталог хакатонов с фильтрами;
- каталог наставников и их навыки.

## Стек

- **Backend:** Java 21, Spring Boot 3.5.16, Spring Security, Spring Data JPA, PostgreSQL, JWT, Maven.
- **Frontend:** React 18, Vite, React Router, Axios, CSS.

## Документация

- [Обзор проекта и запуск](docs/README.md)
- [REST API](docs/API.md)
- [Схема базы данных](docs/DATABASE.md)
- [Правила разработки и Cursor](docs/PROJECT_RULES.md)
- [Roadmap](docs/ROADMAP.md)
- [Список задач](docs/TASKS.md)

## Локальный запуск

Требуются JDK 21, PostgreSQL и Node.js, совместимый с версией Vite проекта.

1. Настройте подключение к PostgreSQL и JWT secret в локальной конфигурации/переменных окружения.
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

Эти команды описывают доступные проверки; успешный запуск в рамках обновления документации не подтверждался. Автоматическое тестовое покрытие будет добавлено следующим этапом.
