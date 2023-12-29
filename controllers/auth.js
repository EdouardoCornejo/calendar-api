const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.status(201).json({
      status: "Success",
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

const userLogin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(400).json({
        status: "Error",
        msg: "Email or password is not correct",
      });
    }

    //Password Confirm
    const validPassword = bcrypt.compareSync(password, existUser.password);

    if (!validPassword) {
      return res.status(400).json({
        status: "Error",
        msg: "Email or password is not correct",
      });
    }

    delete existUser.password;

    res.status(201).json({
      status: "Success",
      uid: existUser.id,
      name: existUser.name,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: "Internal Server Error",
    });
  }
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
