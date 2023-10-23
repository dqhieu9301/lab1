const { DATASTORE } = require("../const/const");
const fs = require("fs");

const findUserByUserName = (username) => {
  const users = JSON.parse(fs.readFileSync(DATASTORE, { encoding: "utf8" }));

  for (const user of users) {
    if (user.username === username) {
      return user;
    }
  }

  return null;
};

module.exports = { findUserByUserName };
