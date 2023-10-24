const jwt = require("jsonwebtoken");

const parseAccessToken = (accessToken, secret) => {
  if (!accessToken) {
    return null;
  }

  try {
    const payload = jwt.verify(accessToken, secret);

    return payload;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const generateTokenFromUser = (user, secret) => {
  const { id, address, phoneNumber, name, username } = user;

  const accessToken = jwt.sign(
    { id, username, name, address, phoneNumber },
    secret,
    {
      expiresIn: "100d",
    }
  );

  return accessToken;
};

module.exports = { parseAccessToken, generateTokenFromUser };
