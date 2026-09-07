import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import Loader from "../components/Loader";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET SINGLE BLOG
  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true);

        console.log("GET BLOG ID:", id);

        const response = await API.get(`/blogs/${id}`);

        console.log("GET SINGLE BLOG:", response.data);

        const blog =
          response.data?.blog || response.data?.data || response.data;

        if (!blog) {
          throw new Error("Blog not found");
        }

        setTitle(blog.title || "");
        setContent(blog.content || "");
      } catch (error) {
        console.error("GET BLOG ERROR:", error);

        toast.error(error.response?.data?.message || "Blog not found", {
          autoClose: 1500,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      toast.error("Invalid blog ID", {
        autoClose: 1500,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });

      navigate("/dashboard");
      return;
    }

    getBlog();
  }, [id, navigate]);

  // UPDATE BLOG
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Please enter blog title", {
        autoClose: 1500,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
      return;
    }

    if (!content.trim()) {
      toast.warning("Please enter blog content", {
        autoClose: 1500,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
      return;
    }

    try {
      setSaving(true);

      console.log("UPDATING BLOG ID:", id);

      const response = await API.put(`/blogs/${id}`, {
        title: title.trim(),
        content: content.trim(),
      });

      console.log("UPDATE RESPONSE:", response.data);

      toast.success("Blog updated successfully! ✨", {
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("UPDATE BLOG ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to update blog", {
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="editor-page">
      <div className="editor-card">
        {/* HEADER */}
        <div className="editor-header">
          <span>📝 Edit Story</span>

          <h1>Update Your Blog</h1>

          <p>Make changes to your published story.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate}>
          {/* TITLE */}
          <label htmlFor="title">Blog Title</label>

          <input
            id="title"
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />

          {/* CONTENT */}
          <label htmlFor="content">Content</label>

          <textarea
            id="content"
            rows="12"
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={saving}
          />

          {/* BUTTONS */}
          <div className="editor-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
              disabled={saving}
            >
              Cancel
            </button>

            <button type="submit" className="publish-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
