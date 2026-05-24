import React from 'react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/TaskTabs.css';

export default function TaskTabs({ pendingCount, completedCount }) {
  const { state, dispatch } = useAppContext();
  const { activeTab } = state.ui;

  return (
    <div className="task-tabs">
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'pending' })}
        >
          Pending Tasks
          {pendingCount > 0 && <span className="tab-count">{pendingCount}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'completed' })}
        >
          Completed Tasks
          {completedCount > 0 && <span className="tab-count">{completedCount}</span>}
        </button>
        <div
          className="tab-indicator"
          style={{
            transform: activeTab === 'pending' ? 'translateX(0)' : 'translateX(100%)',
          }}
        />
      </div>
    </div>
  );
}
