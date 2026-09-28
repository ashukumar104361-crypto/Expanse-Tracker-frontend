import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  Wallet,
  PlusCircle,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';

export const Navbar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/dashboard" className="brand-logo">
            <div className="logo-badge">
              <Wallet size={22} className="logo-icon" />
            </div>
            <div className="logo-text-group">
              <span className="logo-brand">PocketWise</span>
              <span className="logo-tag">Teen Expense</span>
            </div>
          </Link>
        </div>

        <div className="navbar-right">
          <Link to="/add-expense" className="btn btn-sm btn-primary add-quick-btn">
            <PlusCircle size={16} />
            <span>Add Expense</span>
          </Link>

          <div className="user-profile-badge">
            <Link to="/profile" className="profile-pill">
              <div className="avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-display-name">{user?.name?.split(' ')[0] || 'Student'}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="logout-icon-btn"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
