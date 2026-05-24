import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatTimeEstimate, complexityStars, getPriorityLabel } from '../../utils/formatters';
import '../../styles/TaskCard.css';

export default function TaskCard({ task, onComplete, loading, variant = 'pending' }) {
  if (variant === 'completed') {
    return (
      <div className="task-card completed-card animate-fadeIn">
        <div className="task-completed-mark">
          <span className="completed-check">✓</span>
        </div>
        <div className="task-body">
          <div className="task-top">
            <h3 className="task-name completed-name">{task.task_name}</h3>
            <span className="task-completed-date">
              {task.completed_at
                ? new Date(task.completed_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Completed'}
            </span>
          </div>
          <div className="task-meta">
            <Badge variant="category">Category: {task.category}</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-card animate-fadeIn">
      <div className="task-body">
        <div className="task-top">
          {task.category && (
            <span className="task-category-badge">{task.category}</span>
          )}
          <Badge type={`p${task.priority}`}>
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>

        <h3 className="task-name">{task.task_name}</h3>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <span className="task-meta-item">
            {formatTimeEstimate(task.estimated_hours)}
          </span>
          <span className="task-meta-item">
            {complexityStars(task.complexity)} {task.complexity}/5
          </span>
        </div>

        <div className="task-action">
          <Button
            size="sm"
            variant="primary"
            icon="✓"
            loading={loading}
            onClick={() => onComplete(task.task_id)}
            disabled={loading}
          >
            Mark Complete
          </Button>
        </div>
      </div>
    </div>
  );
}
