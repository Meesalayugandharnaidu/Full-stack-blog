import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim() || !password) {
      toast.warning("Please fill all fields", {
        autoClose: 1500,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must contain at least 6 characters", {
        autoClose: 1500,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      return;
    }

    try {
      setLoading(true);

      // Register API
      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      // Success toast
      toast.success("Registration successful! 🎉", {
        autoClose: 1500,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
        onClose: () => {
          navigate("/login");
        },
      });
    } catch (error) {
      console.error("Registration Error:", error);

      toast.error(error.response?.data?.message || "Registration failed", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Icon */}
        <div className="auth-icon">🚀</div>

        <h2>Create Account</h2>

        <p>Join BlogHub and start writing</p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-bottom">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
