const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const scripts = [{ logger: "./src/utils/logger" }];
// import { messages } from './src/data';

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + ""));

app.engine(
    "hbs",
    exphbs({
        defaultLayout: "main",
        extname: ".hbs",
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.redirect("/login");
  });

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/500", (req, res) => {
  res.render("500");
});

app.get("/404", (req, res) => {
  res.render("404");
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        profile: [
            { category: "Почта", content: "pochta@yandex.ru" },
            { category: "Логин", content: "ivanovivan" },
            { category: "Имя", content: "Иван" },
            { category: "Фамилия", content: "Иванов" },
            { category: "Имя в чате", content: "Ваня" },
            { category: "Телефон", content: "8 942 54 33 43" },
        ],
    });
});

app.get("/chat", (req, res) => {
    res.render("chat", {
        message: [
            {
                imgSrc: "../static/img/avatar.png",
                name: "Сергей",
                time: "22:39 24.05",
                text: "Привет, ты уже осовободился? Пошли в кино, скоро будут показывать Рэмбо: Первая кровь",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
            {
                imgSrc: "../static/img/avatar.png",
                name: "Name",
                time: "time",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore fsfgddf fdsfdf",
            },
        ],
    });
});

app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
});
