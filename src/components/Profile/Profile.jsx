import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile, updateProfileAsync } from '../../store/profileSlice';
import './Profile.css';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const profile = useSelector((state) => state.profile);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editData, setEditData] = React.useState({});

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile && !isEditing) {
            setEditData({
                weight: profile.weight || 0,
                height: profile.height || 0,
                age: profile.age || 0,
                bio: profile.bio || "",
                goal: profile.goal || "Build Muscle"
            });
        }
    }, [profile, isEditing]);

    if (profile.loading) {
        return <div className="profile-container"><div className="loader">Loading your fitness data...</div></div>;
    }

    const levelProgress = ((profile.points || 0) % 1000) / 10;

    const getActivityIcon = (type) => {
        switch (type) {
            case 'workout': return '💪';
            case 'diet': return '🥗';
            default: return '✨';
        }
    };

    const handleSave = async (e) => {
        try {
            await dispatch(updateProfileAsync(editData));
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-layout">
                {/* Sidebar Card */}
                <div className="profile-card">
                    <div className="avatar-wrapper">
                        <img
                            src={profile.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=00d2ff&color=fff&size=200`}
                            alt="Profile"
                            className="profile-avatar"
                        />
                        <div className="status-indicator"></div>
                    </div>

                    <div className="user-info">
                        <h2>{user?.name || 'Athlete'}</h2>
                        <span className="user-email">{user?.email || 'athlete@fitai.com'}</span>

                        <div className="level-badge">LVL {Math.floor((profile.points || 0) / 1000) + 1}</div>

                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${levelProgress}%` }}></div>
                        </div>
                        <span className="progress-text">{(profile.points || 0) % 1000}/1000 XP to next level</span>

                        {!isEditing ? (
                            <p className="user-bio">{profile.bio}</p>
                        ) : (
                            <textarea
                                className="edit-input bio-input"
                                value={editData.bio}
                                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                placeholder="Tell us about your fitness journey..."
                            />
                        )}
                    </div>

                    <div className="stats-mini-grid">
                        <div className="stat-item">
                            <span className="val">{profile.streak}</span>
                            <span className="lbl">🔥 Streak</span>
                        </div>
                        <div className="stat-item">
                            <span className="val">{profile.completedWorkouts}</span>
                            <span className="lbl">💪 Workouts</span>
                        </div>
                    </div>

                    {!isEditing ? (
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    ) : (
                        <div className="edit-actions">
                            <button className="save-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    )}
                </div>

                {/* Main Dashboard */}
                <div className="profile-main">
                    {!isEditing ? (
                        <div className="dashboard-section">
                            <h3 className="section-title">Physical Metrics</h3>
                            <div className="features-grid">
                                <div className="feature-card">
                                    <span className="icon">⚖️</span>
                                    <span className="label">Weight</span>
                                    <p className="value">{profile.weight || 0} kg</p>
                                </div>
                                <div className="feature-card">
                                    <span className="icon">📏</span>
                                    <span className="label">Height</span>
                                    <p className="value">{profile.height || 0} cm</p>
                                </div>
                                <div className="feature-card">
                                    <span className="icon">📅</span>
                                    <span className="label">Age</span>
                                    <p className="value">{profile.age || 0} yrs</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="dashboard-section edit-form-section">
                            <h3 className="section-title">Update Your Metrics</h3>
                            <div className="edit-form-grid">
                                <div className="form-group">
                                    <label>Weight (kg)</label>
                                    <input
                                        type="number"
                                        className="edit-input"
                                        value={editData.weight}
                                        onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Height (cm)</label>
                                    <input
                                        type="number"
                                        className="edit-input"
                                        value={editData.height}
                                        onChange={(e) => setEditData({ ...editData, height: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        className="edit-input"
                                        value={editData.age}
                                        onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Primary Goal</label>
                                    <select
                                        className="edit-input select-input"
                                        value={editData.goal}
                                        onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                                    >
                                        <option value="Build Muscle">Build Muscle</option>
                                        <option value="Lose Weight">Lose Weight</option>
                                        <option value="Improve Endurance">Improve Endurance</option>
                                        <option value="General Fitness">General Fitness</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Overview */}
                    <div className="dashboard-section">
                        <h3 className="section-title">Fitness Journey</h3>
                        <div className="features-grid">
                            <div className="feature-card">
                                <span className="icon">🎯</span>
                                <span className="label">Current Goal</span>
                                <p className="value">{profile.goal}</p>
                            </div>
                            <div className="feature-card">
                                <span className="icon">🔥</span>
                                <span className="label">Workouts</span>
                                <p className="value">{profile.completedWorkouts}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="dashboard-section">
                        <h3 className="section-title">Recent Activity</h3>
                        <div className="activity-list">
                            {profile.recentActivity && profile.recentActivity.length > 0 ? (
                                profile.recentActivity.map((activity, index) => (
                                    <div key={activity.id || index} className="activity-item">
                                        <div className="activity-icon">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="activity-info">
                                            <h4>{activity.name}</h4>
                                            <span>{new Date(activity.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-activity">
                                    <span className="icon">⏳</span>
                                    <p>No recent activity found. Start your journey today!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
