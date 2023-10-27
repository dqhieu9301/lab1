const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const { findUserByUserName, updateUserByID } = require("./datastore/dump");
const {
  generateHomeView,
  generateLoginView,
  generateInfoUserView,
} = require("./common/template");
const jwt = require("jsonwebtoken");
const { SECRET_ACCESS_TOKEN } = require("./const/const");
const { parseAccessToken, generateTokenFromUser } = require("./common/auth");
const { isValidAccessToken } = require("./common/auth");
const fs = require("fs");

const createStream = fs.createWriteStream("logs.txt");
createStream.end();

const port = 3000;
const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public\\img")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let reviews = [];

app.get("/", function (req, res) {
  if (req.query.newReview) {
    reviews.push(req.query.newReview);
    fs.writeFileSync("logs.txt",
    req.query.newReview + "\n",
    {
      encoding: "utf8",
      flag: "a+",
      mode: 0o666
    });
  }
  const loginView = generateLoginView();
  const homeView = generateHomeView(reviews);
  const accessToken = req.cookies["accessToken"];
  if (!parseAccessToken(accessToken, SECRET_ACCESS_TOKEN)) {
    res.send(loginView);
    return;
  }

  res.send(homeView);
});

app.get("/info-user", function (req, res) {
  const loginView = generateLoginView();
  const accessToken = req.cookies["accessToken"];
  if (!parseAccessToken(accessToken, SECRET_ACCESS_TOKEN)) {
    res.send(loginView);
    return;
  }

  const infoUserView = generateInfoUserView();
  res.send(infoUserView);
});

app.post("/info-user", function (req, res) {
  const loginView = generateLoginView();
  const accessToken = req.cookies["accessToken"];
  const userPayload = parseAccessToken(accessToken, SECRET_ACCESS_TOKEN);
  if (!userPayload) {
    res.send(loginView);
    return;
  }

  let user = findUserByUserName(userPayload.username);
  const { name, address, phoneNumber } = req.body;

  user = { ...user, name, address, phoneNumber };
  updateUserByID(user.id, user);
  const newAccessToken = generateTokenFromUser(user, SECRET_ACCESS_TOKEN);

  const infoUserView = generateInfoUserView();
  const expirationDate = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000); // 100 days in milliseconds

  res.cookie("accessToken", newAccessToken, {
    maxAge: expirationDate,
    httpOnly: false,
  });

  fs.writeFileSync("logs.txt",
  `username=${name}` + "\n",
  {
    encoding: "utf8",
    flag: "a+",
    mode: 0o666
  });

  res.send(infoUserView);
});

app.get("/login", function (req, res) {
  const loginView = generateLoginView();
  const homeView = generateHomeView(reviews);
  const accessToken = req.cookies["accessToken"];
  if (parseAccessToken(accessToken, SECRET_ACCESS_TOKEN)) {
    res.send(homeView);
    return;
  }

  res.send(loginView);
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;
  const loginView = generateLoginView();

  const userFound = findUserByUserName(username);
  if (!userFound) {
    res.send(loginView);
    return;
  }

  // TODO: generate view failed login
  if (userFound.password !== password) {
    res.send(loginView);
    return;
  }

  const accessToken = generateTokenFromUser(userFound, SECRET_ACCESS_TOKEN);
  const expirationDate = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000); // 100 days in milliseconds

  res.cookie("accessToken", accessToken, {
    maxAge: expirationDate,
    httpOnly: false,
  });
  res.redirect("/")
});

// inital(app)
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
