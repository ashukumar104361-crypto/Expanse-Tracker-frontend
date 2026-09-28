import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Wallet, LogIn, AlertCircle, Sparkles } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('ashu@example.com');
    setPassword('password123');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <Wallet size={28} className="text-white" />
          </div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">
            Log in to track your pocket money, crush your savings goals, and spend smarter.
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
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="ashu@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block auth-submit-btn"
          >
            <LogIn size={18} />
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="demo-credentials-banner">
          <div className="demo-header">
            <Sparkles size={16} className="text-amber" />
            <span>Quick Test Demo Account</span>
          </div>
          <p className="demo-text">Email: <code>ashu@example.com</code> | Password: <code>password123</code></p>
          <button type="button" onClick={handleDemoLogin} className="btn-demo-fill">
            Fill Demo Credentials
          </button>
        </div>

        <div className="auth-footer-prompt">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
