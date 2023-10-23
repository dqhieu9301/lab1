const jwt = require("jsonwebtoken");

const isValidAccessToken = (accessToken, secret) => {
  if (!accessToken) {
    return false;
  }

  try {
    const isAccessTokenValid = jwt.verify(accessToken, secret);

    return !!isAccessTokenValid;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = { isValidAccessToken };
