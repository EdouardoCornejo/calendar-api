const { validateJwt } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const { isDate } = require("../helpers/isDate");
const { check, param } = require("express-validator");
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
    param("id", "Invalid event id").isMongoId(),
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start date is required").custom(isDate),
    check("end", "End date is required").custom(isDate),
    validateFields,
  ],
  updateEvents
);

// Delete events
router.delete(
  "/:id",
  [param("id", "Invalid event id").isMongoId(), validateFields],
  deleteEvents
);

module.exports = router;
