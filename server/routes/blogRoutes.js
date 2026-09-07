const express = require("express");

const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all blogs
router.get("/", getBlogs);

// Get single blog
router.get("/:id", getBlog);

// Create blog
router.post("/", protect, createBlog);

// Update blog
router.put("/:id", protect, updateBlog);

// Delete blog
router.delete("/:id", protect, deleteBlog);

module.exports = router;
