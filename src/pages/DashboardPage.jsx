import React from 'react';
import { useTasks } from '../hooks/useTasks';
import Header from '../components/dashboard/Header';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import ProgressOverview from '../components/dashboard/ProgressOverview';
import TaskTabs from '../components/dashboard/TaskTabs';
import PendingTaskList from '../components/dashboard/PendingTaskList';
import CompletedTaskList from '../components/dashboard/CompletedTaskList';
import ResetModal from '../components/dashboard/ResetModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/DashboardPage.css';

export default function DashboardPage() {
  const {
    tasks,
    pendingTasks,
    completedTasks,
    recommendation,
    progress,
    loading,
    completeTask,
    resetTasks,
  } = useTasks();

  const [showResetModal, setShowResetModal] = React.useState(false);

  const handleReset = async () => {
    await resetTasks();
    setShowResetModal(false);
  };

  const user = { username: localStorage.getItem('username') };

  if (loading && tasks.length === 0) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header
        user={user}
        progress={progress}
        tasks={tasks}
        loading={loading}
      />

      <main className="dashboard-main container">
        <RecommendationCard
          recommendation={recommendation}
          onComplete={completeTask}
          loading={loading}
        />

        <ProgressOverview
          progress={progress}
          completedCount={completedTasks.length}
          totalCount={tasks.length}
          pendingTasks={pendingTasks}
        />

        <TaskTabs
          pendingCount={pendingTasks.length}
          completedCount={completedTasks.length}
        />

        {pendingTasks.length === 0 && completedTasks.length === 0 && !loading ? (
          <div className="empty-state animate-fadeIn">
            <div className="empty-icon empty-icon-generic" />
            <h3>No Tasks Yet</h3>
            <p>Your tasks will appear here once they're loaded.</p>
          </div>
        ) : (
          <>
            <PendingTaskList
              tasks={pendingTasks}
              onComplete={completeTask}
              loading={loading}
            />
            <CompletedTaskList tasks={completedTasks} />
          </>
        )}

        {completedTasks.length > 0 && (
          <div className="reset-section">
            <button
              className="reset-btn"
              onClick={() => setShowResetModal(true)}
            >
              Reset All Tasks
            </button>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="container footer-content">
          <p>TaskFlow AI &copy; 2024</p>
          <div className="footer-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#contact" onClick={(e) => e.preventDefault()}>Contact</a>
          </div>
          <p className="footer-powered">Powered by Machine Learning</p>
        </div>
      </footer>

      {showResetModal && (
        <ResetModal
          onConfirm={handleReset}
          onCancel={() => setShowResetModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
