import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim() || !password) {
      toast.warning("Please fill all fields", {
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
      return;
    }

    try {
      setLoading(true);

      // Login API
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      // Save authentication data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Success notification
      toast.success("Login successful! 🎉", {
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });

      // Navigate after toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login Error:", error);

      toast.error(error.response?.data?.message || "Login failed", {
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>

        <h2>Welcome Back</h2>

        <p>Login to continue to BlogHub</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-bottom">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
