import React, { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import "./WorkoutAnimation.css";

const WorkoutAnimation = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const activeIndex = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 1, 2]);
    const progressFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const exercises = [
        {
            id: 'push',
            title: "Push Exercises",
            desc: "Focus on pushing weight away from the body. Targets chest, shoulders, and triceps.",
            benefits: ["Chest Hypertrophy", "Triceps Strength", "Core Stability"],
            gif: "https://i.giphy.com/wp7qtPT1yAtGPzEbYY.gif"
        },
        {
            id: 'pull',
            title: "Pull Exercises",
            desc: "Movements where you pull the weight towards you. Essential for back and biceps.",
            benefits: ["Back Definition", "Bicep Peak", "Grip Strength"],
            gif: "https://i.giphy.com/yuRdzWqluzYn5eHUQ0.gif"
        },
        {
            id: 'posture',
            title: "Posture Correction",
            desc: "Alignment of the body to prevent injury and improve performance.",
            benefits: ["Spinal Health", "Joint Mobility", "Reduced Pain"],
            gif: "https://i.giphy.com/D12i7IbYdYjaZNsDlA.gif"
        }
    ];

    return (
        <div ref={containerRef} className="workout-animation-section">
            <div className="sticky-container">
                <motion.div 
                    className="animation-content"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="character-panel">
                        <div className="progress-indicator">
                            <motion.div className="progress-bar-fill" style={{ height: progressFill }} />
                        </div>
                        <div className="character-card">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={Math.round(activeIndex.get())}
                                    src={exercises[Math.min(2, Math.max(0, Math.round(activeIndex.get())))].gif}
                                    alt="Exercise Animation"
                                    className="character-gif"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                />
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="text-panel">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={Math.round(activeIndex.get())}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="info-card"
                            >
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Step 0{Math.min(3, Math.max(1, Math.round(activeIndex.get()) + 1))}</span>
                                <h2>{exercises[Math.min(2, Math.max(0, Math.round(activeIndex.get())))].title}</h2>
                                <p style={{ color: 'var(--text-muted)' }}>{exercises[Math.min(2, Math.max(0, Math.round(activeIndex.get())))].desc}</p>
                                <ul className="benefit-list">
                                    {exercises[Math.min(2, Math.max(0, Math.round(activeIndex.get())))].benefits.map((b, i) => (
                                        <li key={i} className="benefit-item">
                                            <div className="benefit-dot" /> {b}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WorkoutAnimation;
