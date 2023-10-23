const express = require("express");
const fs = require('fs');
const path = require('path')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')

const port = 3000;
const app = express();
let reviews = [];


app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public\\img')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', function (req, res) {
  if (req.query.newReview) reviews.push(req.query.newReview);
  const formattedReviews = reviews.map((review)=> `<dt>User</dt><dd>${review}</dd>`).join(' ');
  const template = fs.readFileSync('./templates/index.html', 'utf8');
  const view = template.replace('$reviews$', formattedReviews);
  res.send(view);
});

app.get('/login', function (req, res) {
  const template = fs.readFileSync('./templates/login.html', 'utf8');
  res.send(template);
});

app.post("/login", function (req, res) {
  
})

// inital(app)
app.listen(port, '127.0.0.1', () => {
    console.log(`Example app listening on port ${port}`)
})

