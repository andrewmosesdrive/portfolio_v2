const express = require("express");
const exphbs = require("express-handlebars");
const fetch = require("node-fetch");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// assign variable an object with github credentials as properties
const githubUser = {
  accessToken: process.env.ACCESS_TOKEN,
  userName: "andrewmosesdrive",
};

// variable for pinned projects query in graphql format
const projectsQuery = {
  query: `
      query { 
          user(login: "${githubUser.userName}"){
            pinnedItems(first: 6, types: REPOSITORY) {
              totalCount
              nodes{
                ... on Repository{
                  name
                  createdAt
                  description
                  url
                  openGraphImageUrl
                  }
                }
              }
            }
          }`,
};

// github api endpoint
const githubEndpoint = "https://api.github.com/graphql";

// headers variable following github docs
const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubUser.accessToken,
};

app.get("/", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/portfolio", (req, res) => {
  // fetch data and post it
  fetch(githubEndpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(projectsQuery),
  })
    .then((response) => response.text())
    .then((apiText) => {
      const data = JSON.parse(apiText);
      const currentProjects = data["data"]["user"]["pinnedItems"]["nodes"];
      // console.log(currentProjects);
      res.render("portfolio", { currentProjects, title: "Portfolio" });
    })
    .catch((error) =>
      console.log(
        "You hecked up tryin' to get the GitHub deets! Here's what went down: " +
          error
      )
    );
});

app.get("/contact", (req, res) => {
  res.render("contact", { Title: "Contact" });
});

app.listen(PORT, function () {
  console.log("Listening on http://localhost:" + PORT);
});
