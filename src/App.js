// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Update with your backend URL
const API_URL = 'https://task-recommendation-backend.onrender.com';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchRecommendation();
      fetchProfile();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchRecommendation = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendation(response.data);
    } catch (err) {
      console.error('Error fetching recommendation:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: formData.get('username'),
        password: formData.get('password')
      });
      const { token, user_id, username } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user_id);
      localStorage.setItem('username', username);
      setToken(token);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/register`, {
        username: formData.get('username'),
        password: password
      });
      setError('');
      alert('Registration successful! Please login.');
      document.getElementById('login-tab').click();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const completeTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchTasks();
      await fetchRecommendation();
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Error completing task');
    }
    setLoading(false);
  };

  const resetTasks = async () => {
    if (window.confirm('⚠️ Warning: This will reset ALL your tasks. Are you sure?')) {
      setLoading(true);
      try {
        await axios.post(`${API_URL}/reset_tasks`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchTasks();
        await fetchRecommendation();
        await fetchProfile();
        setError('');
      } catch (err) {
        setError('Error resetting tasks');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    setTasks([]);
    setRecommendation(null);
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>📋 Task Completion Expert System</h1>
          <p className="subtitle">AI-powered task sequencing recommendations</p>
          
          <div className="auth-tabs">
            <button className="tab-btn active" id="login-tab" onClick={() => {
              document.getElementById('login-form').style.display = 'block';
              document.getElementById('register-form').style.display = 'none';
              document.getElementById('login-tab').classList.add('active');
              document.getElementById('register-tab').classList.remove('active');
            }}>Login</button>
            <button className="tab-btn" id="register-tab" onClick={() => {
              document.getElementById('login-form').style.display = 'none';
              document.getElementById('register-form').style.display = 'block';
              document.getElementById('register-tab').classList.add('active');
              document.getElementById('login-tab').classList.remove('active');
            }}>Register</button>
          </div>

          <div id="login-form" style={{display: 'block'}}>
            <form onSubmit={handleLogin}>
              <input name="username" placeholder="Username" required />
              <input name="password" type="password" placeholder="Password" required />
              <button type="submit" className="submit-btn">Login</button>
            </form>
          </div>

          <div id="register-form" style={{display: 'none'}}>
            <form onSubmit={handleRegister}>
              <input name="username" placeholder="Username" required />
              <input name="password" type="password" placeholder="Password" required />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
              <button type="submit" className="submit-btn">Register</button>
            </form>
          </div>

          {error && <div className="error-msg">{error}</div>}
        </div>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const progress = user ? user.progress : 0;

  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <div className="logo">
          <h1>📋 TaskFlow AI</h1>
          <span className="tagline">Smart Task Sequencing</span>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="username">👤 {localStorage.getItem('username')}</span>
            <span className="progress-badge">{Math.round(progress)}% Complete</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Error Message */}
      {error && <div className="error-msg" onClick={() => setError('')}>{error} ✖</div>}

      {/* Recommendation Card */}
      {recommendation && recommendation.recommended_task_name && (
        <div className="recommendation-card">
          <div className="recommendation-icon">🎯</div>
          <div className="recommendation-content">
            <h3>AI Recommendation</h3>
            <div className="recommended-task">
              {recommendation.recommended_task_name}
            </div>
            {recommendation.confidence && (
              <div className="confidence">
                Confidence: {(recommendation.confidence * 100).toFixed(1)}%
              </div>
            )}
            <button 
              onClick={() => completeTask(recommendation.recommended_task_id)}
              disabled={loading}
              className="recommend-btn"
            >
              ✓ Complete This Task
            </button>
          </div>
          {recommendation.top_3 && recommendation.top_3.length > 0 && (
            <div className="alternatives">
              <small>Alternatives:</small>
              <div className="alt-list">
                {recommendation.top_3.slice(1, 3).map(task => (
                  <span key={task.task_id} className="alt-item">
                    {task.task_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span>{completedTasks.length} / {tasks.length} tasks</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>
      </div>

      {/* Task Tabs */}
      <div className="task-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Tasks ({pendingTasks.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Tasks ({completedTasks.length})
        </button>
      </div>

      {/* Pending Tasks */}
      {activeTab === 'pending' && (
        <div className="tasks-grid">
          {pendingTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <p>All tasks completed! Great job!</p>
              <button onClick={resetTasks} className="reset-btn">Start Over</button>
            </div>
          ) : (
            pendingTasks.map(task => (
              <div key={task.task_id} className="task-card">
                <div className="task-header">
                  <h3>{task.task_name}</h3>
                  <span className={`priority priority-${task.priority}`}>
                    P{task.priority}
                  </span>
                </div>
                <div className="task-details">
                  <span>⏱️ {task.estimated_hours}h</span>
                  <span>⚙️ Complexity: {task.complexity}/5</span>
                  <span>📁 {task.category}</span>
                </div>
                <button 
                  onClick={() => completeTask(task.task_id)}
                  disabled={loading}
                  className="complete-btn"
                >
                  ✓ Mark Complete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed Tasks */}
      {activeTab === 'completed' && (
        <div className="tasks-grid">
          {completedTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No completed tasks yet. Start by completing a task!</p>
            </div>
          ) : (
            completedTasks.map(task => (
              <div key={task.task_id} className="task-card completed-card">
                <div className="task-header">
                  <h3>✓ {task.task_name}</h3>
                  <span className="completed-badge">Done</span>
                </div>
                <div className="task-details">
                  <span>⏱️ {task.estimated_hours}h</span>
                  <span>📁 {task.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reset Button */}
      {completedTasks.length > 0 && (
        <div className="reset-section">
          <button onClick={resetTasks} disabled={loading} className="reset-all-btn">
            🔄 Reset All Tasks
          </button>
        </div>
      )}
    </div>
  );
}

export default App;