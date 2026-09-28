import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PiggyBank,
  BarChart3,
  Lightbulb,
  UserCheck,
  LogOut
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/expenses', label: 'Expenses', icon: ReceiptText },
    { path: '/add-expense', label: 'Add Expense', icon: PlusCircle },
    { path: '/budget', label: 'Budget', icon: PiggyBank },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/suggestions', label: 'Suggestions', icon: Lightbulb },
    { path: '/profile', label: 'Profile', icon: UserCheck }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`app-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <p className="sidebar-eyebrow">TEEN FINANCIAL HUB</p>
          <h4 className="sidebar-title">Manage Your Money</h4>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="avatar-small">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="user-details-mini">
              <span className="user-name-label">{user?.name || 'Teen Saver'}</span>
              <span className="user-role-label">Monthly Learner</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-sidebar-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
