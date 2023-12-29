/* 
  Auth routes / Auth
  host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require('../middlewares/validate-fields')
const router = Router();
const {
  revalidateToken,
  userLogin,
  userRegister,
} = require("../controllers/auth");

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be 6 characters").isLength({ min: 6 }),
    validateFields
  ],
  userRegister
);

router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password must be 6 characters").isLength({ min: 6 }),
    validateFields
  ],
  userLogin
);

router.get("/renew", revalidateToken);

module.exports = router;
