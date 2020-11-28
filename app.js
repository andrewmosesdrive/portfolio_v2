// packages needed
// dotenv, node-fetch, express,
const express = require("express");
// const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
// const path = require("path");
// const fs = require("fs");
require("dotenv").config();
// const githubData = require("./githubData")


const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("about")
})

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/portfolio", (req, res) => {
  res.render("portfolio");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// console.log(githubData())

app.listen(PORT, function() {
  console.log("Listening on http://localhost:" + PORT)
});


