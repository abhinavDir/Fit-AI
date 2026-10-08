import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import "./Demo.css";

function Demo() {
  const navigate = useNavigate();

  return (
    <div className="demo-page">
      <div className="demo-overlay"></div>
      
      <div className="demo-content-wrapper">
        <header className="demo-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Home
          </button>
          <div className="demo-badge">
            <span className="pulse-icon"></span> LIVE PREVIEW
          </div>
        </header>

        <section className="video-section">
          <div className="video-glass-container">
            <div className="video-inner">
              <iframe
                src="https://www.youtube.com/embed/ml6cT4AZdqI?autoplay=1"
                title="FitAI Platform Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="video-reflection"></div>
          </div>

          <div className="demo-info">
            <h1>Experience the <span>Future of Fitness</span></h1>
            <p>
              Witness how FitAI leverages cutting-edge generative intelligence to craft 
              your perfect routine, analyze your biomarkers, and optimize your metabolic health.
            </p>
            
            <div className="feature-chips">
              <span className="chip">AI Coaching</span>
              <span className="chip">Smart Dieting</span>
              <span className="chip">Biometric Sync</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Demo;