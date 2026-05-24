import React, { useState } from 'react';
import Button from '../common/Button';
import '../../styles/AuthForm.css';

export default function LoginForm({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(username, password);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="login-email" className="form-label">Username</label>
        <div className="input-wrapper">
          <input
            id="login-email"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="login-password" className="form-label">Password</label>
        <div className="input-wrapper">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          <span>Remember me</span>
        </label>
        <button type="button" className="forgot-link" tabIndex={-1}>
          Forgot password?
        </button>
      </div>

      <Button type="submit" variant="primary" size="md" className="btn-full" loading={loading}>
        Sign In
      </Button>

      <div className="form-divider">
        <span>Or continue with</span>
      </div>

      <div className="social-buttons">
        <button type="button" className="social-btn" disabled>
          Google
        </button>
        <button type="button" className="social-btn" disabled>
          GitHub
        </button>
      </div>

      <p className="form-footer">
        Don't have an account?{' '}
        <button type="button" className="form-link" onClick={onSwitchToRegister}>
          Sign up
        </button>
      </p>
    </form>
  );
}
