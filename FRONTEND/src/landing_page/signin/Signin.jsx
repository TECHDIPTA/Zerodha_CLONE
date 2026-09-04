import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3002";
const CLIENT_URL = import.meta.env?.VITE_CLIENT_URL || "http://localhost:5174";

export default function Signin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(
        data.message ||
          "Invalid credentials. Try again."
      );

      setLoading(false);
      return;
    }

    /*
      Backend may return:

      {
        authenticated: true,
        user: {...}
      }

      So extract the actual user.
    */

    const loggedInUser = data.user || data;

    setUser(loggedInUser);

    toast.success(
      "Successfully logged in!"
    );

    const message = `Welcome back, ${
      loggedInUser.username || "Trader"
    }!`;

    setTimeout(() => {
      window.location.href =
        `${CLIENT_URL}/?flash=${encodeURIComponent(
          message
        )}&type=success`;
    }, 800);

  } catch (err) {
    console.error("Login error:", err);

    toast.error(
      "Could not connect to authentication server."
    );

    setLoading(false);
  }
};

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div style={styles.wrapper}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .zerodha-login-card {
          box-shadow: 0 8px 30px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }

        .kt-field:focus-within .kt-label {
          color: #387ed1;
        }

        .kt-input {
          width: 100%;
          border: none;
          border-bottom: 1.5px solid #d3d7de;
          background: transparent;
          padding: 10px 2px;
          font-size: 15px;
          color: #23252a;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .kt-input:focus {
          border-bottom-color: #387ed1;
        }

        .kt-label {
          font-size: 12px;
          color: #74777f;
          margin-bottom: 4px;
          display: block;
          font-weight: 500;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .kt-btn-primary {
          width: 100%;
          background: #387ed1;
          color: #fff;
          border: none;
          padding: 12px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .kt-btn-primary:hover {
          background: #2b6cb8;
        }

        .kt-btn-primary:disabled {
          background: #a9c6e8;
          cursor: not-allowed;
        }

        .kt-btn-google {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #e2e5ea;
          padding: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #23252a;
          border-radius: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .kt-btn-google:hover {
          border-color: #b8bec9;
          background: #fafbfc;
        }
      `}</style>

      <div className="zerodha-login-card" style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>Z</div>
          <span style={styles.logoText}>Zerodha</span>
        </div>

        <h2 style={styles.title}>Login to Zerodha</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: "28px" }}>
          <div className="kt-field" style={styles.field}>
            <label htmlFor="username" className="kt-label">
              User ID or Email
            </label>
            <input
              id="username"
              className="kt-input"
              type="text"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="kt-field" style={styles.field}>
            <label htmlFor="password" className="kt-label">
              Password
            </label>
            <input
              id="password"
              className="kt-input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="kt-btn-primary"
            disabled={loading}
            style={{ marginTop: "12px" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.dividerRow}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine} />
        </div>

        <button
          type="button"
          className="kt-btn-google"
          onClick={handleGoogleLogin}
        >
          <svg width="17" height="17" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.03l3.01-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.97l3.01 2.33C4.66 5.17 6.65 3.58 9 3.58z"
            />
          </svg>
          Continue with Google
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    paddingTop: "120px",
    paddingBottom: "80px",
    minHeight: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fbfbfc",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  card: {
    background: "#ffffff",
    padding: "40px 36px",
    borderRadius: "6px",
    width: "100%",
    maxWidth: "380px",
    border: "1px solid #e8eaed",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  logoMark: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    background: "#387ed1",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#23252a",
    letterSpacing: "-0.3px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#23252a",
    margin: "0",
    letterSpacing: "-0.3px",
  },
  field: {
    marginBottom: "24px",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0 20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e6e8ec",
  },
  dividerText: {
    fontSize: "11px",
    color: "#a3a7b0",
    letterSpacing: "0.5px",
  },
  footer: {
    marginTop: "28px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "13.5px",
    color: "#74777f",
    margin: 0,
  },
  link: {
    color: "#387ed1",
    textDecoration: "none",
    fontWeight: "500",
  },
};