import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaAppleAlt, FaCalculator, FaUtensils, FaArrowRight, FaSpinner } from "react-icons/fa";
import "./DietPlanner.css";

const DietPlanner = () => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "Select Goal",
    budgetType: "Monthly",
    budget: "",
    dietType: "Non-Vegetarian",
    language: "English"
  });

  const [diet, setDiet] = useState("");
  const [costEstimates, setCostEstimates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const generateDiet = async (targetLang = formData.language) => {
    if (!formData.age || !formData.weight || !formData.height || !formData.goal || formData.goal === "Select Goal") {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setDiet("");
    setCostEstimates(null);
    
    const payload = { ...formData, language: targetLang };
    setFormData(payload);

    try {
      const res = await fetch("http://localhost:8787/api/diet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errorMsg = "Failed to generate diet plan.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch { }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setDiet(data.plan);

      const costSection = data.plan.match(/### ESTIMATED COST SUMMARY([\s\S]*)/i);
      if (costSection) {
        const costText = costSection[1];
        const daily = costText.match(/Daily Spend:\s*(₹[\d,.\s\-\–₹]+)/i)?.[1]?.trim();
        const weekly = costText.match(/Weekly Spend:\s*(₹[\d,.\s\-\–₹]+)/i)?.[1]?.trim();
        const monthly = costText.match(/Monthly Spend:\s*(₹[\d,.\s\-\–₹]+)/i)?.[1]?.trim();

        if (daily || weekly || monthly) {
          setCostEstimates({ daily, weekly, monthly });
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diet-page">
      <h1>AI Diet Planner</h1>
      <p className="diet-subtitle">Get your personalized nutrition strategy in seconds</p>

      <div className="diet-container">
        <div className="diet-features-info">
          <h3><FaAppleAlt style={{ color: "var(--primary)" }} /> Intelligent Nutrition</h3>
          <ul>
            <li><strong>Personalized Macros:</strong> Calculated for your specific goals.</li>
            <li><strong>Budget Friendly:</strong> Tailored to your financial preferences.</li>
            <li><strong>Bilingual Strategy:</strong> Support for English and Hindi.</li>
          </ul>
        </div>

        <div className="diet-form">
          <h2><FaCalculator style={{ color: "var(--primary)" }} /> Your Details</h2>
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" placeholder="25" value={formData.age} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Weight (kg)</label>
            <input type="number" name="weight" placeholder="75" value={formData.weight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Height (cm)</label>
            <input type="number" name="height" placeholder="180" value={formData.height} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Fitness Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange}>
              <option value="Select Goal">Select Goal</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Budget Type</label>
            <select name="budgetType" value={formData.budgetType} onChange={handleChange}>
              <option value="Monthly">Monthly Budget</option>
              <option value="Daily">Daily Budget</option>
            </select>
          </div>
          <div className="form-group">
            <label>Budget Amount (₹)</label>
            <input type="number" name="budget" placeholder="5000" value={formData.budget} onChange={handleChange} />
          </div>
          <div className="form-group" style={{gridColumn: "span 2"}}>
            <label>Dietary Preference</label>
            <select name="dietType" value={formData.dietType} onChange={handleChange}>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegetarian">Vegetarian</option>
            </select>
          </div>

          {error && <p style={{ color: "var(--error)", fontSize: "14px", gridColumn: "span 2" }}>{error}</p>}

          <button onClick={() => generateDiet("English")} disabled={loading}>
            {loading ? <><FaSpinner className="spin" /> Generating...</> : <>Generate Plan <FaArrowRight /></>}
          </button>
        </div>

        {diet && !loading && (
          <div className="diet-result">
            <div className="result-header-row">
              <h2><FaUtensils style={{ color: "var(--primary)" }} /> Your Plan</h2>
              <button className="btn-translate-hindi" onClick={() => generateDiet(formData.language === "English" ? "Hindi" : "English")}>
                {formData.language === "English" ? "Translate to Hindi" : "Translate to English"}
              </button>
            </div>

            {costEstimates && (
              <div className="budget-summary">
                <div className="budget-card"><span>Daily</span><p>{costEstimates.daily}</p></div>
                <div className="budget-card"><span>Weekly</span><p>{costEstimates.weekly}</p></div>
                <div className="budget-card"><span>Monthly</span><p>{costEstimates.monthly}</p></div>
              </div>
            )}

            <div className="markdown-content">
              <ReactMarkdown>{diet.split(/### ESTIMATED COST SUMMARY/i)[0]}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlanner;