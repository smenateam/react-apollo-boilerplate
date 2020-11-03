# react-apollo-boilerplate


1. Найти в проекте все, что содержит `CUSTOM_NAME` и заменить на нужные значения

## Окружение разработчика

### Бэкенд на staging
Для удобства работы можно не разворачивать бэкенд локально, а использовать бэкенд на staging

Для работы из Chrome нужно выключить same-site защиту для кук

1. Введите в адресную строку браузера `chrome://flags/#same-site-by-default-cookies` и поставьте disabled в списке опций
2. Нажмите на кнопку Relaunch
3. Введите в адресную строку браузера `chrome://flags/#cookies-without-same-site-must-be-secure` и поставьте disabled в списке опций
4. Нажмите на кнопку Relaunch

### Фронтенд
##### Устанавка зависимостей
    ```
    npm install
    ```

##### Запуск c hot-reload и перегенерацией graphql схемы
1. Запускаем проект
    ```
    npm run dev
    ```
1. Открываем приложение: 
    - Бэкенд на staging http://localhost:8000

##### Сборка
```bash
npm run build:dev
```

## Staging и Release окружение
Staging и Release окружения разворачиваются с помощью CircleCI

Nginx конфиги находятся в playbooks

Сборка билда производится командой
```
npm run build:staging

# или

npm run build:release
```

## Линтинг
На проекте настроен линтинг на pre-commit, но если очень хочется можно линтить вручную
```bash
npm run lint
```

## Запуск тестов
### e2e-тесты
```bash
npm run test:e2e
```

### unit-тесты
```bash
npm run test:unit
```

## Graphql
[Читать](docs/graphql.md)

## Архитектура
[Читать](docs/architecture.md)

## Работа с Sentry в проекте
[Читать](docs/sentry.md)
