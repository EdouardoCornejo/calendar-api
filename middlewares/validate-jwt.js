const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJwt = (req, res = response, next) => {
  // x-token headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      status: "Error",
      msg: "There is no token in the request",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      status: "Error",
      msg: "Invalid token",
    });
  }

  next();
};

module.exports = {
  validateJwt,
};
