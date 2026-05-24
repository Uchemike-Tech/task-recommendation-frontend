import React from 'react';
import '../../styles/ProgressOverview.css';

export default function ProgressOverview({ progress, completedCount, totalCount, pendingTasks }) {
  const totalHours = pendingTasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);

  return (
    <div className="progress-overview">
      <div className="progress-card">
        <h3 className="progress-card-title">Overall Progress</h3>
        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-bar-text">
            {completedCount}/{totalCount} Tasks Completed
          </span>
        </div>
        <p className="progress-subtext">
          {progress >= 100
            ? 'All tasks completed!'
            : progress >= 50
            ? 'Great pace! Keep going!'
            : 'Good start! Keep pushing forward!'}
        </p>
      </div>

      <div className="progress-card">
        <span className="progress-metric-value">{Math.round(progress)}%</span>
        <span className="progress-metric-label">Completion Rate</span>
        {totalHours > 0 && (
          <span className="progress-metric-sub">
            {totalHours} hours remaining (estimated)
          </span>
        )}
      </div>

      <div className="progress-card">
        <span className="progress-metric-value">{totalHours}h</span>
        <span className="progress-metric-label">Remaining Work</span>
        <span className="progress-metric-sub">
          {totalHours > 0
            ? `Estimated completion by ${new Date(Date.now() + totalHours * 3600000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'No pending tasks'}
        </span>
      </div>
    </div>
  );
}
