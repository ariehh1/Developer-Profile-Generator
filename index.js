"use strict";

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

const html = data => {
  return `<!DOCTYPE html>
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
};
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
];
inquirer.prompt(userInput).then(function(data) {
  console.log(data);
  //   console.log(html);
  //   fs.writeFile("index.html", html(data), function(err) {
  //     if (err) console.log("error", err);
  //   });
});
