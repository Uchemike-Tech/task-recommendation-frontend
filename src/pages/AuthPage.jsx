import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import '../styles/AuthPage.css';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register, error, dispatch } = useAuth();

  const switchTab = (tab) => {
    setActiveTab(tab);
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-pattern" />
        <div className="auth-hero-content">
          <div className="auth-logo">
            <span className="auth-logo-text">TaskFlow AI</span>
          </div>
          <h1 className="auth-hero-title">Intelligent Task Sequencing</h1>
          <p className="auth-hero-subtitle">
            Let AI guide your workflow to maximum efficiency
          </p>
          <ul className="auth-benefits">
            <li className="auth-benefit-item">
              <span>Smart Recommendations</span>
            </li>
            <li className="auth-benefit-item">
              <span>Dependency Resolution</span>
            </li>
            <li className="auth-benefit-item">
              <span>Progress Tracking</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <button
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Create Account
            </button>
            <div
              className="auth-tab-indicator"
              style={{
                transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)',
              }}
            />
          </div>

          <div className="auth-form-body">
            {error && (
              <div className="auth-error animate-slideDown" role="alert">
                {error}
              </div>
            )}
            {activeTab === 'login' ? (
              <LoginForm onLogin={login} onSwitchToRegister={() => switchTab('register')} />
            ) : (
              <RegisterForm onRegister={register} onSwitchToLogin={() => switchTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
