import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { signup, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password
        };

        if (!trimmedData.name || !trimmedData.email || !trimmedData.password) {
            alert('Please fill out all fields');
            return;
        }

        try {
            await signup(trimmedData);
            alert('Registration Successful! Please log in now.');
        } catch (err) {
            console.error("Signup UI error details:", err);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Create Account</h2>
                <p className="subtitle">Start your fitness journey today</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="footer-text">
                    Already have an account? <span onClick={() => navigate('/login')}>Log In</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
