const { response, request } = require("express");
const { validationResult } = require("express-validator");

const userRegister = (req, res = response) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "Error",
      error: errors.mapped(),
    });
  }

  res.status(201).json({
    user: true,
    msg: "register",
    name,
    email,
    password,
  });
};

const userLogin = (req, res = response) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "Error",
      error: errors.mapped(),
    });
  }

  res.status(201).json({
    user: true,
    msg: "login",
    email,
    password,
  });
};

const revalidateToken = (req, res = response) => {
  res.json({
    user: true,
    msg: "token re-token",
  });
};

module.exports = {
  userRegister,
  userLogin,
  revalidateToken,
};
