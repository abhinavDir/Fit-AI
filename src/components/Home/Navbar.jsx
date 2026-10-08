import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FaHome,
  FaInfoCircle,
  FaUserCircle,
  FaDumbbell,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaRobot,
  FaLeaf,
  FaRunning
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const handleToggle = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`navbar ${menuOpen ? "open" : ""}`}>
      {/* Overlay for mobile click-to-close */}
      <div className="overlay" onClick={() => setMenuOpen(false)} />

      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <FaDumbbell className="logo-icon" />
        FitBharat
      </div>

      {/* Mobile Toggle */}
      <div className="menu-icon" onClick={handleToggle}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link">
          <FaHome className="icon" />
          Home
        </Link>

        <Link to="/about" className="nav-link">
          <FaInfoCircle className="icon" />
          About
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/features" className="nav-link">
              <FaDumbbell className="icon" />
              Features
            </Link>
            {/* <Link to="/coach" className="nav-link">
              <FaRobot className="icon" />
              AI Coach
            </Link>
            <Link to="/exercise" className="nav-link">
              <FaRunning className="icon" />
              Exercises
            </Link>
            <Link to="/diet" className="nav-link">
              <FaLeaf className="icon" />
              Diet
            </Link> */}
          </>
        )}

        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
          {theme === "dark" ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </button>

        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">
              <FaUserCircle className="icon" />
              Profile
            </Link>

            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="nav-btn outline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="nav-link btn-login"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="nav-btn"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;