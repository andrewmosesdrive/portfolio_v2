const express = require("express");
const exphbs = require("express-handlebars");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))


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

app.post('/contact', (req, res) => {
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // secure defaults to port 465
    port: 465,
    secure: true,
    // gmail credentials
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  })

  // Specify what the email will look like
  const mailOpts = {
    from: "Your sender info here", // This is ignored by Gmail
    to: GMAIL_USER,
    subject: "You've got mail my dude!",
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  }

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      res.render('contact-failure') // Show a page indicating failure
    }
    else {
      res.render('contact-success') // Show a page indicating success
    }
  })
})


app.listen(PORT, function () {
  console.log("Listening on http://localhost:" + PORT);
});
