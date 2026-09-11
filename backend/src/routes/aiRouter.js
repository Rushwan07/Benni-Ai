const express = require("express");
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/generate").post(authMiddleware.protect, aiController.generateContent)

module.exports = router;