import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Header.css';

export default function Header({ user, progress, tasks, loading }) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;

  return (
    <header className="dashboard-header">
      <div className="header-inner">
        <div className="header-left">
          <div className="header-logo">
            <span className="logo-text">TaskFlow AI</span>
          </div>
        </div>

        <div className="header-right">
          <div className="progress-badge">
            <svg className="progress-ring" width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                transform="rotate(-90 28 28)"
                strokeLinecap="round"
                className="progress-ring-fill"
              />
            </svg>
            <div className="progress-badge-text">
              <span className="progress-percent">{Math.round(progress)}%</span>
              <span className="progress-count">{completedCount}/{totalCount} tasks</span>
            </div>
          </div>

          <div className="user-menu-wrapper">
            <button
              className="user-avatar"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="User menu"
              aria-expanded={menuOpen}
            >
              <span className="avatar-initials">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
            </button>

            {menuOpen && (
              <>
                <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="user-dropdown animate-scaleIn">
                  <div className="dropdown-header">
                    <span className="dropdown-name">
                      {user?.username || 'User'}
                    </span>
                    <span className="dropdown-joined">
                      {user?.joinedDate ? `Member since ${user.joinedDate}` : ''}
                    </span>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Edit Profile
                  </button>
                  <button className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Settings
                  </button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-danger" onClick={logout}>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
    </header>
  );
}
