import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    try {
      const response = await API.get("/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.log("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">✨ Welcome to BlogHub</span>

          <h1>
            Share Your <span>Ideas</span> With The World
          </h1>

          <p>
            Write, discover and connect through meaningful stories and ideas.
          </p>

          <Link to="/create-blog" className="hero-btn">
            Start Writing →
          </Link>
        </div>
      </section>

      <section className="blogs-section">
        <div className="section-header">
          <div>
            <h2>Latest Stories</h2>
            <p>Explore our latest blog posts</p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <Loader />
        ) : filteredBlogs.length === 0 ? (
          <div className="empty-box">
            <h3>No blogs found</h3>
            <p>Try another search or create a new blog.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
