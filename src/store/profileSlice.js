import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from './authSlice';

const API_URL = 'http://localhost:8787/api/user';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || token === 'null' || token === 'undefined') {
                return rejectWithValue({ message: "No valid token found" });
            }
            const response = await axios.get(`${API_URL}/profile`, {
                headers: { authorization: token }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token is invalid or expired, logout user
                dispatch(logout());
            }
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const updateProfileAsync = createAsyncThunk(
    'profile/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/profile`, profileData, {
                headers: { authorization: token }
            });
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    bio: "",
    goal: "",
    weight: 0,
    height: 0,
    age: 0,
    points: 0,
    streak: 0,
    completedWorkouts: 0,
    profilePicture: null,
    recentActivity: [],
    loading: false,
    error: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                Object.assign(state, action.payload);
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
            });
    },
});

export default profileSlice.reducer;
