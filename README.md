## Второй вариант PR Sprint 2 с исправлениями - https://github.com/vadimfrolov/middle.messenger.praktikum.yandex/pull/6

Большое спасибо за комментарии, создал второй PR с исправлениями

- Почистил scss файлы
- Переделал структуру страницы профиля - убрал table
-  Сделал метод getListenerForFormSubmit более универсальным
- Убрал из .gitignore  неверные правила для папки dist
- Удалил версию Node из package.json, оставил только в .nvmrc
- Удалил повторяющиеся стили из src/components/form/form.scss
- Перенёс ширину аватара в класс и инлайн-стиля
- Привёл к одному виду стиль файлов, теперь без окончаний на “;”
- Убрал лишнюю строку в src/components/messages/messages.ts
- Убрал пустые строки в scss файлах
- Убрал комментарии
- Сделал одинаковые отступы в файлах

- некоторые страницы недоделаны, к примеру окно диалога, будет понятнее когда дойдём до бэкенда



![logo png](https://i.pinimg.com/originals/e8/f0/51/e8f051eb8fa84555ae94f95b979df508.gif)
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
## Установка

- `npm install` — установка js библиотек
- `npm start` — запуск рабочей версии на порту 3000
- `npm run build` — сборка стабильной версии

###  Запутался в роутинге, первая страница открыается
### Netlify https://stoic-spence-e5d073.netlify.app/
