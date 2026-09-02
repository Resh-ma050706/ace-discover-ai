const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const { getEvents, getEventById } = require("../controllers/eventController");

const {
  saveEvent,
  removeSavedEvent,
} = require("../controllers/savedEventController");

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/:id/save", authenticate, saveEvent);
router.delete("/:id/save", authenticate, removeSavedEvent);

module.exports = router;
