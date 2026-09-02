const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const { getSavedEvents } = require("../controllers/savedEventController");

const router = express.Router();

router.get("/", authenticate, getSavedEvents);

module.exports = router;
