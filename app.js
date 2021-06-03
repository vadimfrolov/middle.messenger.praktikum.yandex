// const express = require("express");
// const app = express();

// const path = require("path");
// const exphbs = require("express-handlebars");

// const message = require('./src/data');
// const profile = require('./src/formData');

// app.use(express.static(__dirname + ""));

// app.engine(
//     "hbs",
//     exphbs({
//         defaultLayout: "main",
//         extname: ".hbs",
//     })
// );

// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "views"));

// app.get("", (req, res) => {
//     res.redirect("/login");
//   });

// app.get("/about", (req, res) => {
//     res.render("about");
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });

// app.get("/signup", (req, res) => {
//   res.render("signup");
// });

// app.get("/500", (req, res) => {
//   res.render("500");
// });

// app.get("/404", (req, res) => {
//   res.render("404");
// });

// app.get("/profile", (req, res) => {
//     res.render("profile", profile);
// });

// app.get("/chat", (req, res) => {
//     res.render("chat", message );
// });

// module.exports = app;