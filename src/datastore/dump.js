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

const updateUserByID = (id, user) => {
  const users = JSON.parse(fs.readFileSync(DATASTORE, { encoding: "utf8" }));

  for (let i = 0; i < users.length; i++) {
    if (user.id === id) {
      users[i] = user;
      break;
    }
  }

  fs.writeFileSync(DATASTORE, JSON.stringify(users));

  return;
};

module.exports = { findUserByUserName, updateUserByID };
