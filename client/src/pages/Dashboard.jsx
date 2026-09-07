import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import Loader from "../components/Loader";

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await API.get("/blogs");

        console.log("ALL BLOGS:", response.data);

        const allBlogs = Array.isArray(response.data)
          ? response.data
          : response.data.blogs || response.data.data || [];

        const myBlogs = allBlogs.filter((blog) => blog.author === user?.name);

        setBlogs(myBlogs);
      } catch (error) {
        console.error("GET BLOGS ERROR:", error);

        toast.error("Unable to load blogs", {
          autoClose: 1500,
        });
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, [user?.name]);

  // DELETE BLOG
  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/blogs/${id}`);

      setBlogs((previousBlogs) =>
        previousBlogs.filter((blog) => blog.id !== id),
      );

      toast.success("Blog deleted successfully", {
        autoClose: 1500,
      });
    } catch (error) {
      console.error("DELETE BLOG ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to delete blog", {
        autoClose: 1500,
      });
    }
  };

  // EDIT BLOG
  const handleEdit = (blog) => {
    const blogId = blog.id || blog.blog_id || blog._id;

    console.log("EDIT BLOG:", blog);
    console.log("EDIT BLOG ID:", blogId);

    if (!blogId) {
      toast.error("Blog ID not found", {
        autoClose: 1500,
      });
      return;
    }

    navigate(`/edit-blog/${blogId}`);
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <span className="small-title">👋 Welcome back</span>

          <h1>{user?.name || "User"}</h1>

          <p>Manage your published stories.</p>
        </div>

        <Link to="/create-blog" className="create-btn">
          + Create Blog
        </Link>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <span>📝</span>

          <div>
            <h3>{blogs.length}</h3>
            <p>Total Blogs</p>
          </div>
        </div>

        <div className="stat-card">
          <span>👤</span>

          <div>
            <h3>{user?.name || "User"}</h3>
            <p>Author</p>
          </div>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div className="dashboard-content">
        <h2>My Blogs</h2>

        {loading ? (
          <Loader />
        ) : blogs.length === 0 ? (
          <div className="empty-box">
            <h3>No blogs yet ✍️</h3>

            <p>Create your first blog post.</p>

            <Link to="/create-blog" className="hero-btn">
              Create Blog
            </Link>
          </div>
        ) : (
          <div className="dashboard-blog-grid">
            {blogs.map((blog) => {
              const blogId = blog.id || blog.blog_id || blog._id;

              return (
                <div className="dashboard-blog-card" key={blogId}>
                  <h3>{blog.title}</h3>

                  <p>
                    {(blog.content || "").substring(0, 120)}
                    {(blog.content || "").length > 120 ? "..." : ""}
                  </p>

                  <div className="dashboard-actions">
                    {/* VIEW */}
                    <Link to={`/blog/${blogId}`} className="view-btn">
                      View
                    </Link>

                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="edit-btn"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => deleteBlog(blogId)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
