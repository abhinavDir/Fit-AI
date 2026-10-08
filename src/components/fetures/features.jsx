import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDumbbell,
  FaAppleAlt,
  FaHeartbeat,
  FaUtensils,
  FaChartLine,
  FaRobot
} from "react-icons/fa";
import "./features.css";

const GymFeatures = () => {

  const navigate = useNavigate();

  const features = [
    {
      title: "Workout Planner",
      desc: "Create daily workout routines based on your fitness goals.",
      icon: <FaDumbbell />,
      path: "/workout"
    },
    {
      title: "Diet Plan",
      desc: "AI generated diet plan for muscle gain or fat loss.",
      icon: <FaAppleAlt />,
      path: "/diet"
    },
    {
      title: "Exercise Library",
      desc: "Explore exercises with posture and instructions.",
      icon: <FaHeartbeat />,
      path: "/exercise"
    },
    {
      title: "Meal Tracker",
      desc: "Track calories and daily meal nutrition easily.",
      icon: <FaUtensils />,
      path: "/meal"
    },
    {
      title: "Posture Detector",
      desc: "Analyze workout performance and body progress.",
      icon: <FaChartLine />,
      path: "/posture"
    },
    {
      title: "AI Fitness Coach",
      desc: "Get smart AI suggestions for workouts and diet.",
      icon: <FaRobot />,
      path: "/ai-coach"
    }
  ];

  return (
    <section className="gym-features">

      <h1 className="feature-title">FitAI Fitness Tools</h1>
      <p className="feature-subtitle">
        Everything you need for a smarter fitness journey
      </p>

      <div className="feature-grid">

        {features.map((item, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={() => navigate(item.path)}
          >

            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>
            <p>{item.desc}</p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default GymFeatures;