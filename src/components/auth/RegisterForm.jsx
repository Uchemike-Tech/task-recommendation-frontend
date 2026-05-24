import React, { useState, useMemo } from 'react';
import Button from '../common/Button';
import { validatePassword, getStrengthColor } from '../../utils/validators';
import '../../styles/AuthForm.css';

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const strengthColor = getStrengthColor(passwordValidation.strength);
  const strengthPercent = passwordValidation.strength === 'weak' ? 33 : passwordValidation.strength === 'fair' ? 66 : 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) return;
    setLoading(true);
    try {
      await onRegister(username, password);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="reg-name" className="form-label">Username</label>
        <div className="input-wrapper">
          <input
            id="reg-name"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="reg-password" className="form-label">Password</label>
        <div className="input-wrapper">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
        {password.length > 0 && (
          <div className="password-strength">
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{ width: `${strengthPercent}%`, background: strengthColor }}
              />
            </div>
            <span className="strength-label" style={{ color: strengthColor }}>
              {passwordValidation.strength === 'weak' && 'Weak'}
              {passwordValidation.strength === 'fair' && 'Fair'}
              {passwordValidation.strength === 'strong' && 'Strong'}
            </span>
          </div>
        )}
        <ul className="password-requirements">
          <li className={passwordValidation.hasMinLength ? 'met' : ''}>
            {passwordValidation.hasMinLength ? '✓' : '○'} At least 8 characters
          </li>
          <li className={passwordValidation.hasUpperCase ? 'met' : ''}>
            {passwordValidation.hasUpperCase ? '✓' : '○'} One uppercase letter
          </li>
          <li className={passwordValidation.hasNumber ? 'met' : ''}>
            {passwordValidation.hasNumber ? '✓' : '○'} One number
          </li>
        </ul>
      </div>

      <div className="form-field">
        <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
        <div className="input-wrapper">
          <input
            id="reg-confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
          {confirmPassword.length > 0 && (
            <span className="input-validation">
              {passwordsMatch ? '✓' : '✗'}
            </span>
          )}
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <span className="field-error animate-slideDown">Passwords do not match</span>
        )}
      </div>

      <div className="form-field">
        <label className="checkbox-label terms-checkbox">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <span>
            I agree to <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a> &amp;{' '}
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </span>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="btn-full"
        loading={loading}
        disabled={!acceptedTerms || !passwordsMatch}
      >
        Create Account
      </Button>

      <p className="form-footer">
        Already have an account?{' '}
        <button type="button" className="form-link" onClick={onSwitchToLogin}>
          Sign in
        </button>
      </p>
    </form>
  );
}
