import React, { useEffect, useState } from "react";
import "./Exercise.css";

const Exercise = () => {

  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState("chest");
  const [difficultyLevel, setDifficultyLevel] = useState("beginner");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgToggle, setImgToggle] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {

      const res = await fetch("http://localhost:8787/api/exercises/exercise");

      const data = await res.json();

      if (Array.isArray(data)) {
        setExercises(data);
      } else {
        console.error("Invalid API data", data);
      }

    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };

  const filteredExercises = exercises.filter((ex) => {

    const matchBodyPart = bodyPart === "" || ex.bodyPart.includes(bodyPart);

    const exDiff = ex.difficulty ? ex.difficulty.toLowerCase() : "beginner";

    const matchDifficulty =
      difficultyLevel === "" || exDiff === difficultyLevel;

    return matchBodyPart && matchDifficulty;

  });

  const bodyCategories = [
    "chest",
    "back",
    "legs",
    "shoulders",
    "arms",
    "waist",
    "cardio",
    "neck",
  ];

  const difficultyCategories = [
    "beginner",
    "intermediate",
  ];

  useEffect(() => {
    setCurrentIndex(0);
    setImageLoaded(false);
  }, [bodyPart, difficultyLevel]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  // Simulate GIF animation by toggling between two frames
  useEffect(() => {
    const interval = setInterval(() => {
      setImgToggle((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {

    if (currentIndex < filteredExercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }

  };

  const handlePrev = () => {

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredExercises.length - 1);
    }

  };

  const selectedExercise = filteredExercises[currentIndex] || null;

  const getAdvancedDetails = (diff) => {

    switch (diff?.toLowerCase()) {

      case "advanced":
        return {
          reps: "4-5 Sets x 15-20 Reps",
          rest: "45-60s",
          calories: "~120-150 kcal",
          frequency: "4-5 Days / Week",
          intensity: "High (8-9 RPE)",
          dailyLimit: "Max 5-6 exercises/day",
        };

      case "intermediate":
        return {
          reps: "3-4 Sets x 10-12 Reps",
          rest: "60-90s",
          calories: "~80-100 kcal",
          frequency: "3-4 Days / Week",
          intensity: "Moderate (6-7 RPE)",
          dailyLimit: "Max 6-8 exercises/day",
        };

      default:
        return {
          reps: "2-3 Sets x 8-10 Reps",
          rest: "90-120s",
          calories: "~50-70 kcal",
          frequency: "2-3 Days / Week",
          intensity: "Low (4-5 RPE)",
          dailyLimit: "Max 4-5 exercises/day",
        };

    }

  };

  const advStats = selectedExercise
    ? getAdvancedDetails(selectedExercise.difficulty)
    : null;

  return (

    <div className="exercise-page">

      <div className="exercise-header">

        <h1>Premium Workout Guide</h1>

        <p>
          Expertly acurated exercises.{" "} routines available.
          {/* {exercises.length > 0 ? `${exercises.length}+` : "800+"} routines available. */}
        </p>

      </div>

      <div className="filters-section">

        {/* BODY PART FILTER */}

        <div className="filter-group">

          <h3>Target Body Part</h3>

          <div className="chips-container">

            {bodyCategories.map((cat) => (

              <button
                key={cat}
                className={`chip ${bodyPart === cat ? "active" : ""}`}
                onClick={() => setBodyPart(cat)}
              >
                {cat}
              </button>

            ))}

          </div>

        </div>

        {/* DIFFICULTY FILTER */}

        <div className="filter-group">

          <h3>Difficulty Level</h3>

          <div className="chips-container">

            {difficultyCategories.map((diff) => (

              <button
                key={diff}
                className={`chip diff-chip ${difficultyLevel === diff ? "active" : ""
                  }`}
                onClick={() => setDifficultyLevel(diff)}
              >
                {diff}
              </button>

            ))}

          </div>

        </div>

        {/* NAVIGATION */}

        {filteredExercises.length > 0 && (

          <div className="below-filters-nav">

            <button className="nav-arrow-btn" onClick={handlePrev}>
              ❮ Previous
            </button>

            {/* <div className="nav-info-box">
              {currentIndex + 1} / {filteredExercises.length}
            </div> */}

            <button className="nav-arrow-btn" onClick={handleNext}>
              Next ❯
            </button>

          </div>

        )}

      </div>

      {/* MAIN EXERCISE CARD */}

      <div className="exercise-content">

        {selectedExercise ? (

          <div className="focused-exercise-card">

            <div className="showcase-visual">

              <img
                src={imgToggle ? selectedExercise.gifUrl : selectedExercise.gifUrl2}
                alt={selectedExercise.name}
                className={imageLoaded ? "loaded" : "loading"}
                style={{ transition: "opacity 0.1s ease-in-out" }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=No+Animation";
                }}
              />

              {!imageLoaded && <div className="image-skeleton"></div>}

            </div>

            <div className="showcase-details">

              <div className="title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>{selectedExercise.name}</h2>
                <button
                  className="log-workout-btn"
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    await fetch('http://localhost:8787/api/user/activity', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'authorization': token
                      },
                      body: JSON.stringify({
                        points: 50,
                        activityName: `Completed ${selectedExercise.name}`,
                        activityType: 'workout'
                      })
                    });
                    alert('Workout Logged! +50 XP');
                  }}
                  style={{
                    background: 'rgba(0, 210, 255, 0.1)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    color: '#00d2ff',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '0.85rem'
                  }}
                >
                  ✓ LOG
                </button>
              </div>

              <div className="tags-row">

                <span className={`badge ${selectedExercise.difficulty}`}>
                  {selectedExercise.difficulty}
                </span>

                <span className="badge category-badge">
                  {selectedExercise.bodyPart}
                </span>

              </div>

              <div className="stats-showcase-grid">

                <div className="mini-stat">
                  <span className="lbl">Target</span>
                  <span className="val">{selectedExercise.target}</span>
                </div>

                <div className="mini-stat">
                  <span className="lbl">Equipment</span>
                  <span className="val">{selectedExercise.equipment}</span>
                </div>

              </div>

              {/* ADVANCED WORKOUT PLAN */}

              {advStats && (

                <div className="advanced-insights">

                  <h3>Workout Plan</h3>

                  <div className="insights-grid">

                    <div className="insight-item">
                      🔄 {advStats.reps}
                    </div>

                    <div className="insight-item">
                      ⏱ {advStats.rest}
                    </div>

                    <div className="insight-item">
                      🔥 {advStats.calories}
                    </div>

                    <div className="insight-item">
                      ⚡ {advStats.intensity}
                    </div>

                  </div>

                </div>

              )}

              {/* INSTRUCTIONS */}

              {selectedExercise.instructions && (

                <div className="instruction-list">

                  <h3>Steps</h3>

                  <ol>

                    {selectedExercise.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}

                  </ol>

                </div>

              )}

            </div>

          </div>

        ) : (

          <div className="no-data-card">
            <h2>No Exercises Found</h2>
          </div>

        )}

      </div>

    </div>

  );

};

export default Exercise;