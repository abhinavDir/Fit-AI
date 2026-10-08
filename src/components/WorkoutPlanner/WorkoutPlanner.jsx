import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FaRobot, FaDumbbell, FaMagic, FaSpinner } from 'react-icons/fa';
import './WorkoutPlanner.css';

const WorkoutPlanner = () => {
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = async (e) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;

    setIsLoading(true);
    setPlan('');
    setError(null);

    try {
      const prompt = `Generate a detailed workout plan based on this goal: "${goal}". 
      Include:
      1. A Daily routine structure.
      2. A Weekly schedule (Mon-Sun).
      3. Tips for progression.
      Format it nicely using Markdown headers and bullet points.`;

      const res = await fetch("http://localhost:8787/api/coach/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: [], 
          message: prompt,
          language: 'English'
        })
      });

      if (!res.ok) throw new Error("AI Coach is busy. Try again!");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let completePlan = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        completePlan += chunk;
        setPlan(completePlan);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workout-planner-container">
      <div className="planner-header">
        <h1><FaMagic style={{marginRight: '15px'}} /> AI Workout Architect</h1>
        <p>No more generic plans. Tell the AI your goal and get a custom routine instantly.</p>
      </div>

      <div className="generate-section">
        <form onSubmit={generatePlan} className="ai-input-group">
          <label htmlFor="goal" style={{fontWeight: 'bold', color: 'var(--primary-accent)'}}>What is your fitness goal?</label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., I want to build muscle at home with only dumbbells, 4 days a week. Focus on upper body."
          />
          <button type="submit" className="generate-btn" disabled={isLoading || !goal.trim()}>
            {isLoading ? <><FaSpinner className="spin" /> Building your plan...</> : <><FaRobot /> Generate Custom Plan</>}
          </button>
        </form>
      </div>

      <div className="planner-content">
        <div className="recommendation-banner">
          <div className="banner-text">
            <h3>Need form guidance?</h3>
            <p>Once you have your plan, check how to perform the movements in our library.</p>
          </div>
          <Link to="/exercise" className="lib-link">Exercise Library</Link>
        </div>

        {error && <div style={{color: '#ff4d4d', textAlign: 'center', marginBottom: '20px'}}>{error}</div>}

        {plan && (
          <>
            <div className="plan-display animate-fade-in" style={{position: 'relative'}}>
              <button 
                onClick={() => {setPlan(''); setGoal('');}} 
                style={{
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: 'rgba(255,0,0,0.1)', 
                  border: '1px solid rgba(255,0,0,0.2)', 
                  color: '#ff4d4d',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer'
                }}
                title="Clear Plan"
              >
                ×
              </button>
              <ReactMarkdown>{plan}</ReactMarkdown>
            </div>
            {isLoading && (
              <div style={{textAlign: 'center', marginTop: '15px', color: 'var(--primary-accent)'}}>
                <FaSpinner className="spin" /> AI is still thinking...
              </div>
            )}
          </>
        )}

        {!plan && !isLoading && (
          <div className="daily-view">
            <div className="workout-card" style={{textAlign: 'center', gridColumn: '1 / -1'}}>
              <FaDumbbell size={50} style={{color: 'var(--primary-accent)', marginBottom: '20px'}} />
              <h2>Your Custom Plan Will Appear Here</h2>
              <p>Type your goals above to start your AI-powered transformation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanner;
