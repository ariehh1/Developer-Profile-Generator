"use strict";

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const puppeteer = require("puppeteer");
const path = require("path");
const writeFileAsync = util.promisify(fs.writeFile);

function html(data, starLength, color) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
        <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
        <title>Developer Profile Generator</title>
        <style>
        body {
            -webkit-print-color-adjust: exact;
          }
            h1, h2, h3, h4, h5, h6 {
                background-color: ${color};
                color: white;
                font-size: 5rem;
                font-family: 'BioRhyme', serif;
                margin: 0;
            }
            @page {
              margin: 0;
            }
           *,
           *::after,
           *::before {
           box-sizing: border-box;
           }
           html, body {
           padding: 0;
           margin: 0;
           }
           
           body {
           background-color: white;
           -webkit-print-color-adjust: exact !important;
           font-family: 'Cabin', sans-serif;
           }
           main {
           background-color: #E9EDEE;
           height: auto;
           padding-top: 30px;
           }
           h1, h2, h3, h4, h5, h6 {
           font-family: 'BioRhyme', serif;
           margin: 0;
           }
           h1 {
           font-size: 3em;
           }
           h2 {
           font-size: 2.5em;
           }
           h3 {
           font-size: 2em;
           }
           h4 {
           font-size: 1.5em;
           }
           h5 {
           font-size: 1.3em;
           }
           h6 {
           font-size: 1.2em;
           }
       
           .photo-header h1, .photo-header h2 {
           width: 100%;
           text-align: center;
           }
           .photo-header h1 {
           margin-top: 10px;
           }
           .links-nav {
           width: 100%;
           text-align: center;
           padding: 20px 0;
           font-size: 1.1em;
           }
           .nav-link {
           display: inline-block;
           margin: 5px 10px;
           }
           .workExp-date {
           font-style: italic;
           font-size: .7em;
           text-align: right;
           margin-top: 10px;
           }
           .container {
             position: relative;
           padding: 50px;
           padding-left: 100px;
           padding-right: 100px;
           }
  
           .row {
             display: flex;
             flex-wrap: wrap;
             justify-content: space-between;
             margin-top: 20px;
             margin-bottom: 20px;
           }
  
           img {
            border-radius: 50%;
           }
          
           .img-parent {
             display: flex;
             justify-content: center;
           }
           
           .col {
           flex: 1;
           text-align: center;
           }
  
           a, a:hover {
           text-decoration: none;
           color: inherit;
           font-weight: bold;
           }
  
           @media print { 
            body { 
              zoom: .75; 
            } 
           }
        </style>
      </head>
      <body>
      <div class="wrapper">
      <div class='photo-header'>
        <div class= 'img-parent'>
        <img src="${data.avatar_url}">
        </div>
        <h1>Hi!</h1>
        <h2>My name is ${data.name}</h2>
        <h3>Currently @ ${data.company}</h3>
        <div class="links-nav">
          <a class="nav-link" href="https://www.google.com/maps/place/${
            data.location.split(" ")[0]
          }+${data.location.split(" ")[1]}">${data.location}</a>
          <a class="nav-link" href="${data.html_url}">Github</a>
          <a class="nav-link" href="${data.blog}">Blog</a>
        </div>
      </div>

      <div class="row">
        <div class='col card'>
          <h2>Public Repositories</h1>
          ${data.public_repos}
        </div>
        <div class="col card">
          <h2>Followers</h1>
          ${data.followers}
        </div>
      </div>
      <div class="row">
        <div class="card col">
          <h2>GitHub Stars</h2>
          ${starLength}
        </div>
        <div class="card col">
          <h2>Following</h2>
          ${data.following}
        </div>
      </div>

    </body>
    </html>
    `;
}

const userInput = [
  {
    message: "Enter your GitHub username:",
    name: "username"
  },
  {
    message: "What is your favorite color?",
    name: "color",
    type: "list",
    choices: ["Red", "Green", "Blue", "Orange"]
  }
];

async function initial() {
  try {
    const { username, color } = await inquirer.prompt(userInput);
    const queryUrl = `https://api.github.com/users/${username}`;
    const queryUrl1 = `${queryUrl}/starred`;
    const { data: userGithub } = await axios.get(queryUrl);
    console.log(userGithub);
    const { data: starred } = await axios.get(queryUrl1);
    const starLength = starred.length;

    await writeFileAsync(
      "index.html",
      html(userGithub, starLength, color),
      "utf8"
    );

    await printPDF();

    // console.log(`Starred length is ${starred.length}`);
  } catch (err) {
    console.error(err);
  }
}

initial();

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${path.resolve(__dirname, "index.html")}`, {
    waitUntil: "networkidle0"
  });
  const pdf = await page.pdf({ format: "A4" });
  await writeFileAsync("resume.pdf", pdf, "binary");

  await browser.close();
  return pdf;
}
