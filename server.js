// const express = require("express");
// const path = require("path");
// const exphbs = require("express-handlebars");
// // const scripts = [{ logger: "./src/utils/logger" }];
// const message = require('./src/data');
// const profile = require('./src/formData');

// const app = express();
// const PORT = 3000;

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

// app.get("/", (req, res) => {
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

// app.listen(PORT, function () {
//     console.log(`Example app listening on port ${PORT}!`);
// });

// module.exports = app;
const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(port)
