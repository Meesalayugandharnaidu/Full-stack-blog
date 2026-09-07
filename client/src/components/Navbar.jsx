import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully", {
      autoClose: 1500,
    });

    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Blog<span>Hub</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <Link to="/create-blog">Create Blog</Link>

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register" className="nav-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
