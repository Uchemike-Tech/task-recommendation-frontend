import React from 'react';
import { useAppContext } from '../../context/AppContext';
import TaskCard from './TaskCard';
import '../../styles/TaskList.css';

export default function PendingTaskList({ tasks, onComplete, loading }) {
  const { state } = useAppContext();
  const { viewMode } = state.ui;

  if (loading && tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line w-40" />
              <div className="skeleton-line w-80" />
              <div className="skeleton-line w-60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="empty-state animate-fadeIn">
          <div className="empty-icon-check" />
          <h3 className="empty-title">All Tasks Completed!</h3>
          <p className="empty-text">
            Amazing work! Reset your tasks to continue learning.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className={`task-grid ${viewMode === 'list' ? 'task-list-view' : ''}`}>
        {tasks.map((task) => (
          <TaskCard
            key={task.task_id}
            task={task}
            onComplete={onComplete}
            loading={loading}
            variant="pending"
          />
        ))}
      </div>
    </div>
  );
}
