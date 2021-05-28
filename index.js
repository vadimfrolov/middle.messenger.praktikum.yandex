const express = require('express');
const path = require("path");
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + ''));

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', 'hbs')
app.set("views", path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "views"));

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/chat', (req, res) => {
  res.render('chat')
})

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});