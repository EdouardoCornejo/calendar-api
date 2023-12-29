const { response } = require("express");
const User = require("../models/User");

const userRegister = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: "Error",
        msg: "Email already exist",
      });
    }

    const user = new User(req.body);

    await user.save();

    res.status(201).json({
      user: true,
      uid: user.id,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: "Internal Server Error",
    });
  }
};

const userLogin = (req, res = response) => {
  const { email, password } = req.body;

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
