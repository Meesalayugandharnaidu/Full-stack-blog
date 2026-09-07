import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlog();
  }, [id]);

  const getBlog = async () => {
    try {
      const response = await API.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.log("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return (
      <div className="empty-box">
        <h2>Blog Not Found</h2>

        <Link to="/" className="hero-btn">
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="details-page">
      <article className="details-card">
        <div className="details-category">BLOG STORY</div>

        <h1>{blog.title}</h1>

        <div className="details-author">
          <div className="author-avatar">{blog.author?.charAt(0)}</div>

          <div>
            <strong>{blog.author}</strong>

            <p>{new Date(blog.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="details-content">{blog.content}</div>

        <Link to="/" className="back-link">
          ← Back to Blogs
        </Link>
      </article>
    </div>
  );
}

export default BlogDetails;
