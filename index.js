"use strict";

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
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

initial();
async function initial() {
  try {
    const { username, color } = await inquirer.prompt(userInput);
    const queryUrl = `https://api.github.com/users/${username}`;
    const { data } = await axios.get(queryUrl);

    await writeFileAsync("index.html", html(data, color), "utf8");

    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

const puppeteer = require("puppeteer");

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://blog.risingstack.com", {
    waitUntil: "networkidle0"
  });
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();
  return pdf;
}
