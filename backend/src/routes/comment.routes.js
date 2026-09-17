const express = require("express");
const router = express.Router();
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const commentController = require("../controllers/comment.controller");

router.post("/", authUserMiddleware, commentController.createComment);
router.get("/:foodId", authUserMiddleware, commentController.getCommentsByFood);
router.delete("/:id", authUserMiddleware, commentController.deleteComment);

module.exports = router;
