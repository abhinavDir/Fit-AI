import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Navbar from './components/Home/Navbar';
import Hero from './components/Home/Hero';
import About from './components/Home/About';
import GymFeatures from './components/features/features';
import Footer from './components/Footer/Footer';
import { useAuth } from './hooks/useAuth';
import DietPlanner from './components/Diet/DietPlanner';
import Exercise from './components/Exercise/Exercise';
import Profile from './components/Profile/Profile';
import FloatingIcons from './components/FloatingIcons/FloatingIcons';
import AiCoach from './components/AiCoach/AiCoach';
import Demo from './components/Demo/Demovideo.jsx';
import WorkoutPage from './components/Posture/WorkoutPage.jsx';
import WorkoutAnimation from './components/Home/WorkoutAnimation';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <div className="home-page">
        <FloatingIcons />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/features" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/features" />} />
          <Route path="/features" element={<ProtectedRoute><GymFeatures /><Footer /></ProtectedRoute>} />
          <Route path="/diet" element={<ProtectedRoute><DietPlanner /></ProtectedRoute>} />
          <Route path="/about" element={<><About /><Footer /></>} />
          <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
          <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
          <Route path="/coach" element={<ProtectedRoute><AiCoach /></ProtectedRoute>} />
          <Route path="/posture" element={<ProtectedRoute><WorkoutPage /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/" element={
            <>
              <Hero />

              <About />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
