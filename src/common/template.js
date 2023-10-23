const fs = require("fs");

const generateHomeView = (reviews) => {
  const formattedReviews = reviews
    .map((review) => `<dt>User</dt><dd>${review}</dd>`)
    .join(" ");
  const template = fs.readFileSync("./templates/index.html", "utf8");
  const view = template.replace("$reviews$", formattedReviews);

  return view;
};

const generateLoginView = () => {
  const template = fs.readFileSync("./templates/login.html", "utf8");

  return template;
};

module.exports = { generateHomeView, generateLoginView };
