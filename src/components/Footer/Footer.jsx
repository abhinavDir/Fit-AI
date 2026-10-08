import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaDumbbell } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-glow"></div>

            <div className="footer-content">
                <div className="footer-section brand-section">
                    <div className="footer-logo">
                        <FaDumbbell className="logo-icon" />
                        <h2>Fit<span>AI</span></h2>
                    </div>
                    <p className="brand-description">
                        Your personal AI-powered fitness journey. We bring elite coaching, precision nutrition, and real-time tracking straight to your fingertips.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" className="social-icon" aria-label="LinkedIn"><FaLinkedinIn /></a>
                    </div>
                </div>

                <div className="footer-section links-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/features">Features</Link></li>
                        <li><Link to="/diet">Diet Plan</Link></li>
                        <li><Link to="/exercise">Exercises</Link></li>
                    </ul>
                </div>

                <div className="footer-section links-section">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section newsletter-section">
                    <h3>Stay Updated</h3>
                    <p>Subscribe to our newsletter for the latest fitness tips and AI updates.</p>

                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-divider"></div>
                <p>&copy; {new Date().getFullYear()} FitAI. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
