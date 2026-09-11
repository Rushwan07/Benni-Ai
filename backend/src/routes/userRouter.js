const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware")


router.route("/createuser").post(userController.createUser);
router.route("/login").post(userController.login);
router.route("/logout").post(userController.logout);
router.get("/me", authMiddleware.protect, userController.getMe);


module.exports = router;