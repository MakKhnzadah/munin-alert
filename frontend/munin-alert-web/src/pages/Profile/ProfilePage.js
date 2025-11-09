import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ProfilePage.css';

/**
 * ProfilePage Component
 * 
 * This component displays user profile information and allows the user to update
 * their personal information, change password, and manage account settings.
 * 
 * @returns {JSX.Element} The rendered profile page component
 */
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user data into form when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        ...profileData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (profileData.newPassword !== profileData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    try {
      await axios.put('/api/users/change-password', {
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setIsChangingPassword(false);
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password. Please check your current password.' 
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {message.text}
          </div>
        )}
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="profile-title">
              <h2>{user?.firstName} {user?.lastName}</h2>
              <p>{user?.email}</p>
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-info-item">
                <span className="info-label">First Name:</span>
                <span className="info-value">{profileData.firstName}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">Last Name:</span>
                <span className="info-value">{profileData.lastName}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{profileData.email}</span>
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">Phone Number:</span>
                <span className="info-value">{profileData.phoneNumber || 'Not set'}</span>
              </div>
              
              <button 
                className="btn btn-primary" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-card">
          <h3>Security Settings</h3>
          
          {isChangingPassword ? (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Change Password</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsChangingPassword(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button 
              className="btn btn-outline" 
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
