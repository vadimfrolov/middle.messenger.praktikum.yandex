<<<<<<< HEAD
const express = require("express");
=======
const express = require('express');
>>>>>>> sprint_3

const app = express();
const PORT = 3000;

<<<<<<< HEAD
app.use(express.static(__dirname + "/dist"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
=======
app.use(express.static('./dist'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
>>>>>>> sprint_3
});
