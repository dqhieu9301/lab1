const fs = require("fs");

const generateHomeView = (reviews) => {
  const formattedReviews = reviews
    .map((review) => `<dt></dt><dd>${review}</dd>`)
    .join(" ");
  const template = fs.readFileSync("./templates/index.html", "utf8");
  const view = template.replace("$content$", formattedReviews);

  return view;
};

const generateLoginView = () => {
  const template = fs.readFileSync("./templates/login.html", "utf8");

  return template;
};

const generateInfoUserView = () => {
  const template = fs.readFileSync("./templates/infor_user.html", "utf8");

  return template;
};

module.exports = { generateHomeView, generateLoginView, generateInfoUserView };
