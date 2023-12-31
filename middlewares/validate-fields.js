const { response } = require("express");
const { validationResult } = require("express-validator");

const validateFields = (req, res = response, next) => {
  // handle error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "Error",
      error: errors.mapped(),
    });
  }

  next();
};

module.exports = {
  validateFields,
};
