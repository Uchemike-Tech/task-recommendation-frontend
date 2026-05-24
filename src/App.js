import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import Toast from './components/common/Toast';
import './styles/App.css';

function AppContent() {
  const { state } = useAppContext();
  const isAuthenticated = !!state.token;

  return (
    <div className="app">
      <Toast />
      {isAuthenticated ? <DashboardPage /> : <AuthPage />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
