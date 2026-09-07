import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  return (
    <article className="blog-card">
      <div className="blog-top">
        <span className="blog-emoji">📝</span>

        <span className="blog-tag">BLOG</span>
      </div>

      <h3>{blog.title}</h3>

      <p>
        {blog.content.substring(0, 140)}
        ...
      </p>

      <div className="blog-footer">
        <div>
          <strong>{blog.author}</strong>

          <small>{new Date(blog.created_at).toLocaleDateString()}</small>
        </div>

        <Link to={`/blog/${blog.id}`}>Read More →</Link>
      </div>
    </article>
  );
}

export default BlogCard;
