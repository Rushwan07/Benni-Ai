const express = require("express");

const docController = require("../controllers/docController");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();


router.route("/documnets").get(authMiddleware.protect, docController.getMyDocuments);
router.route("/create")
    .post(authMiddleware.protect, docController.createDocument);
router.route("/update/:id")
    .patch(authMiddleware.protect, docController.updateDocument);
router.route("/delete/:id")
    .delete(authMiddleware.protect, docController.deleteDocument);
module.exports = router;