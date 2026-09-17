const commentModel = require("../models/comment.model");

async function createComment(req, res) {
  try {
    const { food, text } = req.body;

    if (!food || !text) {
      return res.status(400).json({ message: "food id aur text dono zaroori hain" });
    }

    const comment = await commentModel.create({
      user: req.user._id,
      food,
      text,
    });

    const populatedComment = await comment.populate("user", "fullName");

    res.status(201).json({
      message: "Comment add ho gaya",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: "Comment add karne mein error", error: err.message });
  }
}

async function getCommentsByFood(req, res) {
  try {
    const { foodId } = req.params;

    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (err) {
    res.status(500).json({ message: "Comments fetch karne mein error", error: err.message });
  }
}

async function deleteComment(req, res) {
  try {
    const { id } = req.params;

    const comment = await commentModel.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment nahi mila" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Aap sirf apna comment delete kar sakte hain" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment delete ho gaya" });
  } catch (err) {
    res.status(500).json({ message: "Comment delete karne mein error", error: err.message });
  }
}

module.exports = {
  createComment,
  getCommentsByFood,
  deleteComment,
};
