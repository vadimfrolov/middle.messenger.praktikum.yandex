## PR с исправлениями Sprint 1 - https://github.com/vadimfrolov/middle.messenger.praktikum.yandex/pull/5

Исправления по замечаниям из первого PR:

- Страница на Netlify теперь доступна https://stoic-spence-e5d073.netlify.app/
- npm run dev - теперь работает
- данные из форм теперь в общем массиве из name и value
- добавил в Prettier настройку "endOfLine": "lf"
- убрал из кэша git папку dist, и добавил её в .gitignore
- для рендера данных через app вынес мокап данные в data.js и formData.js
- исправил команду в package.json на "dev": "parcel ./index.html"
- подключил handlebars в 2х html файлах signup и chat, в дальнейшем, когда будет понятно как нужно будет сделать для этого приложения роутинг и прочии функции, структура может поменяться



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
- `npm run start` — запуск стаьбильной версии на порту 3000

###  Есть проблема с запуском dev версии в через npm run dev и связкой между index.html и Handlebars.
### Netlify https://stoic-spence-e5d073.netlify.app/
