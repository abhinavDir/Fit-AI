import React from "react";
import { FaBolt, FaLeaf, FaChartLine, FaUsers, FaBrain, FaDumbbell, FaTrophy, FaHeartbeat } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./About.css";

const About = () => {
    const { isAuthenticated } = useAuth();
    const values = [
        {
            icon: <FaBrain />,
            title: "AI-Powered Precision",
            desc: "Our core engine analyzes your genetics, lifestyle, and goals to build a plan that adapts as you grow."
        },
        {
            icon: <FaLeaf />,
            title: "Holistic Nutrition",
            desc: "We don't just count calories. We focus on macro-nutrient balance tailored to fuel your specific workouts."
        },
        {
            icon: <FaChartLine />,
            title: "Data-Driven Results",
            desc: "Visualize your transformation with deep analytics. Every rep, every meal, quantified for success."
        }
    ];

    const stats = [
        { value: "50K+", label: "Active Users" },
        { value: "1M+", label: "Workouts Generated" },
        { value: "98%", label: "Success Rate" },
        { value: "24/7", label: "AI Support" }
    ];

    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>Redefining Fitness with <span>Artificial Intelligence</span></h1>
                    <p>
                        FitBharat isn't just an app; it's your personal trainer, nutritionist, and accountability partner, all powered by next-generation machine learning.
                    </p>
                    <div className="about-hero-stats">
                        {stats.map((stat, index) => (
                            <div className="stat-box" key={index}>
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="about-hero-image">
                    <div className="image-wrapper">
                        <img src="https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=1470&auto=format&fit=crop"
                            alt="Workout" />
                    </div>
                </div>
            </section>

            <section className="about-mission">
                <div className="mission-container">
                    <div className="mission-text">
                        <h2>Our <span>Mission</span></h2>
                        <p>
                            We believe that elite-level fitness coaching shouldn't be a luxury reserved for professional athletes.
                            By harnessing the power of Artificial Intelligence, we are democratizing scientifically-backed training
                            and nutrition.
                        </p>
                        <p>
                            FitBharat bridges the gap between where you are and where you want to be.
                        </p>
                    </div>
                    <div className="mission-visual">
                        <div className="visual-circle">
                            <FaHeartbeat className="pulse-icon" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-values" id="about">
                <div className="container">
                    <div className="section-header">
                        <h2>The Pillars of <span>FitBharat</span></h2>
                        <p>What makes our platform different from traditional fitness trackers.</p>
                    </div>

                    <div className="values-grid">
                        {values.map((val, index) => (
                            <div className="value-card" key={index}>
                                <div className="value-icon">{val.icon}</div>
                                <h3>{val.title}</h3>
                                <p>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div className="cta-content">
                    <h2>Ready to <span>Transform</span> Your Life?</h2>
                    <p>Stop guessing. Start progressing. Let AI build your perfect routine today.</p>
                    <Link to={isAuthenticated ? "/features" : "/signup"} className="cta-button">
                        {isAuthenticated ? "Go to Dashboard" : "Join FitBharat Now"}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
