const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const userRegister = async (req, res = response) => {
  const { name, email, password } = req.body;
  const emailClean = email.toLowerCase();

  try {
    let userExist = await User.findOne({ emailClean });

    if (userExist) {
      return res.status(400).json({
        status: "Error",
        msg: "Email already exist",
      });
    }

    const user = new User({ name, email: emailClean, password });

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    //JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      status: "Success",
      uid: user.id,
      name: user.name,
      token,
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

    //JWT
    const token = await generateJWT(existUser.id, existUser.name);

    res.status(200).json({
      status: "Success",
      uid: existUser.id,
      name: existUser.name,
      token,
    });
  } catch (error) {
    console.log("🚀 ~ file: auth.js:76 ~ userLogin ~ error:", error);
    res.status(500).json({
      status: "Error",
      msg: "Internal Server Error",
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;

  //Jwt
  const token = await generateJWT(uid, name);

  res.json({
    status: "Success",
    uid,
    name,
    token,
  });
};

module.exports = {
  userRegister,
  userLogin,
  revalidateToken,
};
