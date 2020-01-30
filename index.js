"use strict";

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

const data = {};
let userInput = [
  {
    message: "Enter your GitHub username:",
    name: "username"
  },
  {
    message: "What is your favorite color?",
    name: "color",
    type: "list",
    choices: ["Red", "Green", "Blue", "Yellow"]
  }
].then(function(data) {
  console.log(data);
  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Document</title>
        <style>
            h1 {
                background-color: green;
                color: blue;
                font-size: 5rem;
            }
        </style>
      </head>
      <body>
      <h1>${data.username}</h1><h2>${data.location}</h2></body>
    </html>
    `;
  console.log(html);
  fs.writeFile("index.html", html, function(err) {
    if (err) console.log("error", err);
  });
});
promptUser()
  .then(answers => {
    const html = generateHTML(answers);

    return writeFileAsync("index.html", html);
  })
  .then(() => {
    console.log("Successfully wrote to index.html");
  })
  .catch(console.error);
