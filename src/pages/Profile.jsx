import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import {
  UserCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  Calendar,
  Wallet
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    monthly_income: user?.monthly_income || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        age: user.age || '',
        monthly_income: user.monthly_income || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setIsUpdatingProfile(true);

    try {
      const res = await authService.updateProfile({
        name: profileData.name,
        age: parseInt(profileData.age, 10),
        monthly_income: parseFloat(profileData.monthly_income)
      });
      if (res.success && res.data?.user) {
        updateUser(res.data.user);
        setProfileSuccess('Profile updated successfully!');
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header-row">
        <div>
          <span className="badge-pill-teen">
            <UserCheck size={14} /> Account Settings
          </span>
          <h1 className="page-heading">Your Student Profile</h1>
          <p className="page-subheading">
            Manage your personal information, monthly allowance, and account security.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Column: Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <h3 className="profile-user-name">{user?.name}</h3>
          <p className="profile-user-email">{user?.email}</p>

          <div className="profile-stats-list">
            <div className="profile-stat-row">
              <span className="stat-label">
                <Calendar size={16} /> Member Since
              </span>
              <span className="stat-value">{formatDate(user?.created_at)}</span>
            </div>
            <div className="profile-stat-row">
              <span className="stat-label">
                <Wallet size={16} /> Monthly Allowance
              </span>
              <span className="stat-value">{formatCurrency(user?.monthly_income || 0)}</span>
            </div>
            <div className="profile-stat-row">
              <span className="stat-label">
                <ShieldCheck size={16} /> Security
              </span>
              <span className="stat-value text-emerald">bcrypt Protected</span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="profile-forms-col">
          {/* Edit Profile Form */}
          <div className="form-card-container">
            <h3 className="form-card-title">Edit Details</h3>
            <p className="form-card-subtitle">Keep your name and monthly allowance up to date</p>

            {profileSuccess && (
              <div className="alert-box alert-success">
                <CheckCircle2 size={18} />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="alert-box alert-danger">
                <AlertCircle size={18} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    min="10"
                    max="99"
                    className="form-control"
                    value={profileData.age}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, age: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Allowance (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="form-control"
                    value={profileData.monthly_income}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, monthly_income: e.target.value }))
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="btn btn-primary"
              >
                <Save size={18} />
                <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="form-card-container">
            <h3 className="form-card-title">Change Password</h3>
            <p className="form-card-subtitle">
              Verify your current password to update securely with bcrypt hashing.
            </p>

            {passwordSuccess && (
              <div className="alert-box alert-success">
                <CheckCircle2 size={18} />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="alert-box alert-danger">
                <AlertCircle size={18} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))
                  }
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="btn btn-primary"
              >
                <KeyRound size={18} />
                <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
