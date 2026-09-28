import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Wallet, UserPlus, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '17',
    monthlyIncome: '5000'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age, 10),
        monthlyIncome: parseFloat(formData.monthlyIncome)
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <Wallet size={28} className="text-white" />
          </div>
          <h2 className="auth-title">Create Student Account</h2>
          <p className="auth-subtitle">
            Take full control of your pocket money, allowance, and spending habits today!
          </p>
        </div>

        {error && (
          <div className="alert-box alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Your Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="e.g. Ashu Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="ashu@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Create Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="age">
                Your Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="10"
                max="99"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="monthlyIncome">
                Monthly Allowance (₹)
              </label>
              <input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                min="0"
                step="any"
                className="form-control"
                placeholder="5000"
                value={formData.monthlyIncome}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block auth-submit-btn"
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
          </button>
        </form>

        <div className="auth-footer-prompt">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
