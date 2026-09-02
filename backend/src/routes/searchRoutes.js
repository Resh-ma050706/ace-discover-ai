const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { search } = require("../controllers/searchController");

const router = express.Router();

router.post("/", authenticate, search);

module.exports = router;
