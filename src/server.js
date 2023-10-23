const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const { findUserByUserName } = require("./datastore/dump");
const { generateHomeView, generateLoginView, generateInforUserView } = require("./common/template");
const jwt = require("jsonwebtoken");
const { SECRET_ACCESS_TOKEN } = require("./const/const");
const { isValidAccessToken } = require("./common/auth");

const port = 3000;
const app = express();
let reviews = [];

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public\\img")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
  const loginView = generateLoginView();
  const homeView = generateHomeView(reviews);
  const accessToken = req.cookies["accessToken"];
  if (!isValidAccessToken(accessToken, SECRET_ACCESS_TOKEN)) {
    res.send(loginView);
    return;
  }

  if (req.query.newReview) reviews.push(req.query.newReview);

  res.send(homeView);
});

app.get("/infor-user", function(req, res) {
  const inforUserView  = generateInforUserView()
  res.send(inforUserView)
})

app.get("/login", function (req, res) {
  const loginView = generateLoginView();
  const homeView = generateHomeView(reviews);
  const accessToken = req.cookies["accessToken"];
  if (isValidAccessToken(accessToken, SECRET_ACCESS_TOKEN)) {
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

  const { id } = userFound;

  const accessToken = jwt.sign({ id, username }, SECRET_ACCESS_TOKEN, {
    expiresIn: "100d",
  });

  const expirationDate = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000); // 100 days in milliseconds

  const homeView = generateHomeView(reviews);
  res.cookie("accessToken", accessToken, {
    maxAge: expirationDate,
    httpOnly: false,
  });
  res.send(homeView);
});

// inital(app)
app.listen(port, "127.0.0.1", () => {
  console.log(`Example app listening on port ${port}`);
});
