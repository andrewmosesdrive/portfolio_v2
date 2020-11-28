const fetch = require("node-fetch");
require("dotenv").config();

function githubData() {

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
      console.log(currentProjects);
    })
    .catch((error) =>
      console.log(
        "You hecked up tryin' to get the GitHub deets! Here's what went down: " +
          error
      )
    );

//   function createRepoEntries(currentProjects) {

//     currentProjects.forEach((currentProjects) => {
//       let projectTile = `
//         <div class="img-container">
//         <img src="${currentProjects.openGraphImageUrl}"</div>
//         <div><span>${currentProjects.description}</span>
//         <h5 class="card-title">${currentProjects.url}</h5>
//         </div>
//       `
//     //   console.log(projectTile)
//     })
//   }

//   createRepoEntries(currentProjects)
}

module.exports = githubData;
