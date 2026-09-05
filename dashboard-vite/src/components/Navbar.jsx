
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./Navbar.css";
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3002";

const AUTH_CLIENT_URL =
  import.meta.env.VITE_AUTH_CLIENT_URL ||
  "http://localhost:5173";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
  },
  {
    label: "Orders",
    path: "/orders",
  },
  {
    label: "Holdings",
    path: "/holdings",
  },
  {
    label: "Positions",
    path: "/positions",
  },
  {
    label: "Funds",
    path: "/funds",
  },
  {
    label: "Apps",
    path: "/apps",
  },
];

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const {
    user,
    showToast,
  } = useContext(GeneralContext);

  const dropdownRef = useRef(null);

  // ==========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      showToast?.(
        "Logged out successfully",
        "success"
      );

      // IMPORTANT:
      // Logout destroys the server session.
      // Only NOW do we leave the dashboard.

      window.location.replace(
        `${AUTH_CLIENT_URL}/home`
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      showToast?.(
        "Logout failed. Please try again.",
        "error"
      );
    }
  };

  // ==========================================
  // USER INITIALS
  // ==========================================

  const initials =
    user?.username
      ?.slice(0, 2)
      .toUpperCase() || "ZU";

  return (
    <header className="navbar-container">

      {/* ================================
          LEFT
      ================================= */}

      <div className="navbar-left">

        <Link
          to="/"
          className="logo-link"
          onClick={() =>
            setDropdownOpen(false)
          }
        >
          <img
            src="/logo.png"
            className="navbar-logo"
            alt="Logo"
          />
        </Link>

        <div className="indices-panel">

          <div className="index-pill">
            <span className="index-name">
              NIFTY 50
            </span>

            <span className="index-val loss">
              24,320.50
            </span>
          </div>

          <div
            className="index-divider"
            aria-hidden="true"
          />

          <div className="index-pill">
            <span className="index-name">
              SENSEX
            </span>

            <span className="index-val loss">
              79,890.15
            </span>
          </div>

        </div>
      </div>

      <div
        className="navbar-divider"
        aria-hidden="true"
      />

      {/* ================================
          RIGHT
      ================================= */}

      <div className="navbar-right">

        <nav className="desktop-links">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive
                  ? "active"
                  : ""
              }
            >
              {item.label}
            </NavLink>
          ))}

        </nav>

        {/* ================================
            PROFILE
        ================================= */}

        <div
          className="profile-wrapper"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="profile-badge"
            onClick={() =>
              setDropdownOpen(
                (previous) => !previous
              )
            }
            aria-expanded={dropdownOpen}
          >
            <div className="avatar-ring">
              {initials}
            </div>

            <span className="user-id">
              {user?.username || "USERID"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown-card">

              <Link
                to="/profile"
                onClick={() =>
                  setDropdownOpen(false)
                }
              >
                My Profile
              </Link>

              <Link
                to="/settings"
                onClick={() =>
                  setDropdownOpen(false)
                }
              >
                Settings
              </Link>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;

