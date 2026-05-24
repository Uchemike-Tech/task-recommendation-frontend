import React from 'react';
import TaskCard from './TaskCard';
import '../../styles/TaskList.css';

export default function CompletedTaskList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="empty-state animate-fadeIn">
          <div className="empty-icon-clipboard" />
          <h3 className="empty-title">No Completed Tasks</h3>
          <p className="empty-text">
            No completed tasks yet. Start marking tasks complete!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.task_id}
            task={task}
            variant="completed"
          />
        ))}
      </div>
    </div>
  );
}
