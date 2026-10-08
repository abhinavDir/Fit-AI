import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Hero.css";

const Hero = () => {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
    "https://images.unsplash.com/photo-1581009137042-c552e485697a"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // 3D mouse tilt
  const handleMouseMove = (e) => {

    const card = document.querySelector(".hero-image");

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -20;
    const rotateY = (x / rect.width - 0.5) * 20;

    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = () => {
    const card = document.querySelector(".hero-image");
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <section className="hero">

      <div className="hero-container">

        <div className="hero-text">

          <h1>
            Your AI Powered
            <span>Fitness Journey</span>
          </h1>

          <p>
            Get personalized workout plans, AI powered diet tracking
            and real-time progress monitoring in one platform.
          </p>

          <div className="hero-buttons">

            <button
              className="btn-primary"
              onClick={() =>
                navigate(isAuthenticated ? "/features" : "/login")
              }
            >
              Get Started
            </button>

            <button
              className="btn-secondary"
              onClick={() =>
                navigate(isAuthenticated ? "/demo" : "/login")
              }
            >
              Watch Demo
            </button>

          </div>

        </div>

        <div
          className="hero-image"
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
        >

          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="fitness"
              className={
                index === currentImageIndex ? "active" : ""
              }
            />
          ))}

        </div>

      </div>

    </section>
  );
};

export default Hero;