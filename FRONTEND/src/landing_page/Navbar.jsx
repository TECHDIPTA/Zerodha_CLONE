import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL ||
  "http://localhost:5174";

function Navbar() {
  const {
    user,
    logout,
    loading,
  } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  // =========================================================
  // SHOW LOGOUT MESSAGE AFTER REDIRECT
  // =========================================================

  useEffect(() => {
    const logoutMessage =
      sessionStorage.getItem(
        "logoutSuccessMessage"
      );

    if (logoutMessage) {
      sessionStorage.removeItem(
        "logoutSuccessMessage"
      );

      setTimeout(() => {
        toast.success(logoutMessage);
      }, 300);
    }
  }, []);

  // =========================================================
  // CLOSE NAVBAR
  // =========================================================

  const closeNavbar = () => {
    setMenuOpen(false);
  };

  // =========================================================
  // GO TO DASHBOARD
  // =========================================================

  const handleDashboard = () => {
    closeNavbar();

    window.location.href = DASHBOARD_URL;
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    closeNavbar();

    try {
      const success = await logout();

      if (!success) {
        return;
      }

      /*
        Save message before leaving the dashboard/auth page.
      */

      sessionStorage.setItem(
        "logoutSuccessMessage",
        "You have been logged out successfully!"
      );

      /*
        IMPORTANT:
        Do NOT use /home here.

        Your Vercel deployment is returning:
        GET /home -> 404

        Send the user to the root of the authentication
        frontend instead.
      */

      window.location.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error(
        "Logout failed. Please try again."
      );
    }
  };

  // =========================================================
  // PLACEHOLDER LINKS
  // =========================================================

  const handlePlaceholderClick = (event) => {
    event.preventDefault();
    closeNavbar();
  };

  const isLoggedIn =
    !loading && !!user;

  const isLoggedOut =
    !loading && !user;

  return (
    <nav className="site-navbar">

      <div className="site-navbar-inner">

        {/* BRAND */}

        <Link
          className="navbar-brand"
          to="/"
          onClick={closeNavbar}
        >
          <img
            src="/media/logo.svg"
            alt="Zerodha"
            className="navbar-logo"
          />
        </Link>

        {/* RIGHT SIDE */}

        <div className="navbar-right">

          <ul className="nav-links-desktop">

            {/* SIGNUP */}

            {isLoggedOut && (
              <li>
                <Link
                  to="/signup"
                  onClick={closeNavbar}
                >
                  Signup
                </Link>
              </li>
            )}

            {/* ABOUT */}

            <li>
              <Link
                to="/about"
                onClick={closeNavbar}
              >
                About
              </Link>
            </li>

            {/* PRODUCTS */}

            <li>
              <Link
                to="/product"
                onClick={closeNavbar}
              >
                Products
              </Link>
            </li>

            {/* PRICING */}

            <li>
              <Link
                to="/pricing"
                onClick={closeNavbar}
              >
                Pricing
              </Link>
            </li>

            {/* SUPPORT */}

            <li>
              <Link
                to="/support"
                onClick={closeNavbar}
              >
                Support
              </Link>
            </li>

            {/* AUTHENTICATED USER */}

            {isLoggedIn ? (
              <>
                <li>
                  <button
                    type="button"
                    className="nav-link-btn"
                    onClick={handleDashboard}
                  >
                    Dashboard
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="nav-link-btn"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              isLoggedOut && (
                <li>
                  <Link
                    to="/signin"
                    onClick={closeNavbar}
                  >
                    Signin
                  </Link>
                </li>
              )
            )}

          </ul>

          {/* HAMBURGER */}

          <button
            type="button"
            className={`hamburger-btn ${
              menuOpen ? "open" : ""
            }`}
            onClick={() =>
              setMenuOpen(
                (previous) => !previous
              )
            }
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </div>

      {/* =====================================================
          MEGA MENU
      ===================================================== */}

      {menuOpen && (
        <div className="mega-menu-container">

          <div className="mega-menu-content">

            {/* MOBILE LINKS */}

            <div className="mobile-only-links">

              <div className="mobile-nav-grid">

                {isLoggedOut && (
                  <Link
                    to="/signup"
                    onClick={closeNavbar}
                  >
                    Signup
                  </Link>
                )}

                <Link
                  to="/about"
                  onClick={closeNavbar}
                >
                  About
                </Link>

                <Link
                  to="/product"
                  onClick={closeNavbar}
                >
                  Products
                </Link>

                <Link
                  to="/pricing"
                  onClick={closeNavbar}
                >
                  Pricing
                </Link>

                <Link
                  to="/support"
                  onClick={closeNavbar}
                >
                  Support
                </Link>

                {isLoggedIn ? (
                  <>
                    <button
                      type="button"
                      className="nav-link-btn text-link"
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </button>

                    <button
                      type="button"
                      className="nav-link-btn text-link"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  isLoggedOut && (
                    <Link
                      to="/signin"
                      onClick={closeNavbar}
                    >
                      Signin
                    </Link>
                  )
                )}

              </div>

              <hr className="menu-divider" />

            </div>

            {/* PRODUCT GRID */}

            <div className="products-grid">

              {/* KITE */}

              <Link
                to="/signup"
                className="product-item"
                onClick={closeNavbar}
              >
                <div className="product-icon-wrap">

                  <svg
                    viewBox="0 0 40 40"
                    className="product-svg"
                  >
                    <polygon
                      points="6,16 22,6 34,14 18,24"
                      fill="#FF5722"
                    />

                    <polygon
                      points="6,19 18,27 18,35 6,26"
                      fill="#E64A19"
                    />

                    <polygon
                      points="21,27 34,18 34,26 21,35"
                      fill="#FF7043"
                    />
                  </svg>

                </div>

                <div>
                  <h4>Kite</h4>
                  <p>Trading platform</p>
                </div>
              </Link>

              {/* CONSOLE */}

              <a
                href="#"
                className="product-item"
                onClick={handlePlaceholderClick}
              >
                <div className="product-icon-wrap">

                  <svg
                    viewBox="0 0 40 40"
                    className="product-svg"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="13"
                      fill="none"
                      stroke="#0052CC"
                      strokeWidth="6.5"
                    />
                  </svg>

                </div>

                <div>
                  <h4>Console</h4>
                  <p>Backoffice</p>
                </div>
              </a>

              {/* KITE CONNECT */}

              <a
                href="#"
                className="product-item"
                onClick={handlePlaceholderClick}
              >
                <div className="product-icon-wrap">

                  <svg
                    viewBox="0 0 40 40"
                    className="product-svg"
                  >
                    <path
                      d="
                        M20 7
                        L32 14
                        L32 26
                        L20 33
                        L8 26
                        L8 14
                        Z
                      "
                      fill="none"
                      stroke="#424242"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />

                    <path
                      d="
                        M20 20
                        L32 14
                        M20 20
                        L8 14
                        M20 20
                        L20 33
                      "
                      stroke="#424242"
                      strokeWidth="2.5"
                    />

                    <circle
                      cx="20"
                      cy="20"
                      r="2.5"
                      fill="#424242"
                    />
                  </svg>

                </div>

                <div>
                  <h4>Kite Connect</h4>
                  <p>Trading APIs</p>
                </div>
              </a>

              {/* COIN */}

              <a
                href="#"
                className="product-item"
                onClick={handlePlaceholderClick}
              >
                <div className="product-icon-wrap">

                  <svg
                    viewBox="0 0 40 40"
                    className="product-svg"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      fill="#37474F"
                    />

                    <path
                      d="
                        M12 26
                        A 14 14 0 0 1 28 12
                      "
                      fill="#FBC02D"
                    />

                    <circle
                      cx="20"
                      cy="20"
                      r="6"
                      fill="#F57F17"
                    />
                  </svg>

                </div>

                <div>
                  <h4>Coin</h4>
                  <p>Mutual funds</p>
                </div>
              </a>

            </div>

            {/* COLUMNS */}

            <div className="links-columns">

              {/* UTILITIES */}

              <div className="menu-column">

                <h5 className="column-title">
                  Utilities
                </h5>

                <ul className="column-links">

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      Calculators
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      Brokerage calculator
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      Margin calculator
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      SIP calculator
                    </a>
                  </li>

                </ul>

              </div>

              {/* UPDATES */}

              <div className="menu-column">

                <h5 className="column-title">
                  Updates
                </h5>

                <ul className="column-links">

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      Z-Connect blog
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      Circulars / Bulletin
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      IPOs
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={handlePlaceholderClick}
                    >
                      Markets
                    </a>
                  </li>

                </ul>

              </div>

              {/* EDUCATION */}

              <div className="menu-column">

                <h5 className="column-title">
                  Education
                </h5>

                <ul className="column-links">

                  <li>
                    <a
                      href="#"
                      className="edu-link"
                      onClick={handlePlaceholderClick}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        className="edu-svg-icon"
                      >
                        <defs>
                          <linearGradient
                            id="varsityGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#70a6ff"
                            />

                            <stop
                              offset="100%"
                              stopColor="#2e6cd1"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="
                            M4 4
                            H28
                            C28 18 16 28 16 28
                            C16 28 4 18 4 4
                            Z
                          "
                          fill="url(#varsityGrad)"
                        />

                        <text
                          x="16"
                          y="20"
                          fill="#fff"
                          fontSize="14"
                          fontWeight="800"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          V
                        </text>
                      </svg>

                      <span>
                        Varsity
                      </span>

                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="edu-link"
                      onClick={handlePlaceholderClick}
                    >
                      <svg
                        viewBox="0 0 32 32"
                        className="edu-svg-icon"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="22"
                          height="18"
                          rx="3"
                          fill="none"
                          stroke="#00BCD4"
                          strokeWidth="2.5"
                        />

                        <path
                          d="
                            M12 23
                            L9 28
                            L17 23
                          "
                          fill="#00BCD4"
                        />

                        <text
                          x="16"
                          y="18"
                          fill="#00BCD4"
                          fontSize="12"
                          fontWeight="700"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          Q
                        </text>
                      </svg>

                      <span>
                        Trading Q&amp;A
                      </span>

                    </a>
                  </li>

                </ul>

              </div>

            </div>

          </div>
        </div>
      )}

    </nav>
  );
}

export default Navbar;