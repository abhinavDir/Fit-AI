import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginSuccess, logout as logoutAction } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8787/api/auth/login', credentials);
            dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
            navigate('/features');
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8787/api/auth/register', userData);
            navigate('/login');
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Signup failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        dispatch(logoutAction());
        navigate('/login');
    };

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        signup,
        logout,
    };
};
