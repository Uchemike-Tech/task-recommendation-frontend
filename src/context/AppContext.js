import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext();

const initialState = {
  token: null,
  user: null,
  tasks: [],
  recommendation: null,
  loading: false,
  loadingMessage: '',
  error: null,
  ui: {
    activeTab: 'pending',
    viewMode: 'grid',
    sidebarOpen: false,
    menuOpen: false,
  },
  toasts: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOAD_TASKS_START':
      return { ...state, loading: true, loadingMessage: 'Loading tasks...' };
    case 'LOAD_TASKS_SUCCESS':
      return { ...state, loading: false, loadingMessage: '', tasks: action.payload };
    case 'LOAD_TASKS_ERROR':
      return { ...state, loading: false, loadingMessage: '', error: action.payload };
    case 'COMPLETE_TASK_START':
      return { ...state, loading: true, loadingMessage: 'Completing task...' };
    case 'COMPLETE_TASK_SUCCESS':
      return { ...state, loading: false, loadingMessage: '' };
     case 'COMPLETE_TASK_ERROR':
      return { ...state, loading: false, loadingMessage: '', error: action.payload }; 
    case 'FETCH_RECOMMENDATION_SUCCESS':
      return { ...state, recommendation: action.payload };
    case 'RESET_TASKS_START':
      return { ...state, loading: true, loadingMessage: 'Resetting tasks...' };
    case 'RESET_TASKS_SUCCESS':
      return { ...state, loading: false, loadingMessage: '' };
     case 'RESET_TASKS_ERROR':
      return { ...state, loading: false, loadingMessage: '', error: action.payload }; 
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.payload },
      };
    case 'TOGGLE_VIEW_MODE':
      return {
        ...state,
        ui: { ...state.ui, viewMode: state.ui.viewMode === 'grid' ? 'list' : 'grid' },
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
      };
    case 'TOGGLE_MENU':
      return {
        ...state,
        ui: { ...state.ui, menuOpen: !state.ui.menuOpen },
      };
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { id: Date.now(), ...action.payload }],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    case 'LOGOUT':
      return {
        ...initialState,
        toasts: state.toasts,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToast = useCallback((type, message) => {
    dispatch({ type: 'ADD_TOAST', payload: { type, message } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: Date.now() });
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
