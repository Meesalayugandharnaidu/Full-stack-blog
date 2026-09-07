const db = require("../config/db");

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const [blogs] = await db.promise().query(`
      SELECT 
        blogs.id,
        blogs.title,
        blogs.content,
        blogs.created_at,
        users.name AS author
      FROM blogs
      JOIN users ON blogs.author_id = users.id
      ORDER BY blogs.created_at DESC
    `);

    res.json(blogs);
  } catch (error) {
    console.error("Get Blogs Error:", error);

    res.status(500).json({
      message: "Failed to get blogs",
    });
  }
};

// Get single blog
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const [blogs] = await db.promise().query(
      `
      SELECT 
        blogs.id,
        blogs.title,
        blogs.content,
        blogs.created_at,
        users.name AS author
      FROM blogs
      JOIN users ON blogs.author_id = users.id
      WHERE blogs.id = ?
      `,
      [id],
    );

    if (blogs.length === 0) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(blogs[0]);
  } catch (error) {
    console.error("Get Blog Error:", error);

    res.status(500).json({
      message: "Failed to get blog",
    });
  }
};

// Create blog
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    await db.promise().query(
      `
      INSERT INTO blogs
      (title, content, author_id)
      VALUES (?, ?, ?)
      `,
      [title, content, req.user.id],
    );

    res.status(201).json({
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error("Create Blog Error:", error);

    res.status(500).json({
      message: "Failed to create blog",
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const [result] = await db.promise().query(
      `
      UPDATE blogs
      SET title = ?, content = ?
      WHERE id = ? AND author_id = ?
      `,
      [title, content, id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Blog not found or you are not the author",
      });
    }

    res.json({
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("Update Blog Error:", error);

    res.status(500).json({
      message: "Failed to update blog",
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      `
      DELETE FROM blogs
      WHERE id = ? AND author_id = ?
      `,
      [id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Blog not found or you are not the author",
      });
    }

    res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete Blog Error:", error);

    res.status(500).json({
      message: "Failed to delete blog",
    });
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
