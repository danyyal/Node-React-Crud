const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: user.id,
  };

  const token = jwt.sign(data, jwtSecretKey);
  return token;
};
const validateToken = (req) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
    const token = req.headers[tokenHeaderKey].split(" ")[1];

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return true;
    } else {
      // Access Denied
      return false;
    }
  } catch (error) {
    // Access Denied
    return false;
  }
};

module.exports = {
  generateToken,
  validateToken,
};
