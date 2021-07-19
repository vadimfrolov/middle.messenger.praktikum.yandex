## PR Sprint 4 - https://github.com/vadimfrolov/middle.messenger.praktikum.yandex/pull/10
## PR Sprint 3 - https://github.com/vadimfrolov/middle.messenger.praktikum.yandex/pull/9

19.07

- добавил Docker
- добавил настройки webpack
## Heroku - https://chat-yp.herokuapp.com/

Есть проблема с запуском приложения в heroku - билдится успешно, но ошибки в логе при попытке зайти такие:
```
2021-07-19T17:25:31.453794+00:00 heroku[router]: at=error code=H10 desc="App crashed" method=GET path="/" host=chat-yp.herokuapp.com request_id=8b3b5b8a-3ed5-4f72-83ee-17864d8d0858 fwd="128.72.36.198" dyno= connect= service= status=503 bytes= protocol=https
2021-07-19T17:25:31.629260+00:00 heroku[router]: at=error code=H10 desc="App crashed" method=GET path="/favicon.ico" host=chat-yp.herokuapp.com request_id=a9c6da07-2a03-434f-9e55-be266e0fceae fwd="128.72.36.198" dyno= connect= service= status=503 bytes= protocol=https
```

буду признателен, если подскажете, в чём может быть ошибка

08.07

- убрал код в комментах
- сделал диапазон для кодов ошибок
- изменил имена для оттенков цвета
- добавил класс hidden
- вынес цвет кнопки в переменную
- убрал мутабельность options - добавил переменную
- улучшил читаемость импортов в chat.ts

06.07

- добавил роутинг
- подключен API чата
- добавил тесты mocha


### Figma https://www.figma.com/file/EdZGkH1oXP3PEgGmWlNA3L/Chat?node-id=0%3A1

## Стек
* **Parcel**
* **Handlebars**
* **Less**
* **HTML/CSS**
* **JS**

## Готовые страницы
* **/login** - логин
* **/signup** - регистрация
* **/chat** - выбор чата
* **/profile** - профиль
* **/500** - ошибка 500
* **/404** - ошибка 404

---
## Описание

Чат на основе шаблонизатора Handlebars и JavaScript.
## Установка и запуск

- `npm install` — установка js библиотек
- `npm start` — запуск рабочей версии на порту 3000
- `npm run build` — сборка стабильной версии
- `npm run test` — запуск тестов
### Netlify https://stoic-spence-e5d073.netlify.app/
