const { validateJwt } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const { isDate } = require("../helpers/isDate");
const { check } = require("express-validator");
const { Router } = require("express");
const {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
} = require("../controllers/events");

const router = Router();

//All with token validation
router.use(validateJwt);

// Get events
router.get("/", getEvents);

// Create new events
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start date is required").custom(isDate),
    check("end", "End date is required").custom(isDate),
    validateFields,
  ],
  createEvents
);

// Update events
router.put(
  "/:id",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start date is required").custom(isDate),
    check("end", "End date is required").custom(isDate),
    validateFields,
  ],
  updateEvents
);

// Delete events
router.delete("/:id", deleteEvents);

module.exports = router;
