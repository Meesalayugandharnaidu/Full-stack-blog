import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function CreateBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.warning("Please enter title and content", {
        autoClose: 1500,
      });
      return;
    }

    try {
      setLoading(true);

      await API.post("/blogs", {
        title: title.trim(),
        content: content.trim(),
      });

      // Show success toast
      const toastId = toast.success("Blog published successfully! 🎉", {
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });

      // Clear form
      setTitle("");
      setContent("");

      // Go dashboard after 1.5 seconds
      setTimeout(() => {
        toast.dismiss(toastId);
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog", {
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-card">
        <div className="editor-header">
          <span>✍️ Create New Story</span>

          <h1>Write Something Amazing</h1>

          <p>Share your thoughts with the BlogHub community.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Blog Title</label>

          <input
            id="title"
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <label htmlFor="content">Content</label>

          <textarea
            id="content"
            rows="12"
            placeholder="Start writing your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />

          <div className="editor-actions">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="publish-btn" disabled={loading}>
              {loading ? "Publishing..." : "Publish Blog 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
