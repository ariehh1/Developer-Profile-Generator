"use strict";

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const puppeteer = require("puppeteer");
const path = require("path");
const writeFileAsync = util.promisify(fs.writeFile);

function html(data, color) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Document</title>
        <style>
        body {
            -webkit-print-color-adjust: exact;
          }
            h1 {
                background-color: ${color};
                color: blue;
                font-size: 5rem;
            }
        </style>
      </head>
      <body>
      <h1>${data.name}</h1><h2>${data.location}</h2></body>
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
    choices: ["Red", "Green", "Blue", "Yellow"]
  }
];

async function initial() {
  try {
    const { username, color } = await inquirer.prompt(userInput);
    const queryUrl = `https://api.github.com/users/${username}`;
    const queryUrl1 = `${queryUrl}/starred`;
    const { data: userGithubInfor } = await axios.get(queryUrl);
    const { data: starredInfor } = await axios.get(queryUrl1);

    await writeFileAsync("index.html", html(userGithubInfor, color), "utf8");

    await printPDF();

    console.log(userGithubInfor, starredInfor.length);
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
