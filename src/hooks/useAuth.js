import { useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { authApi } from '../utils/api';
import { storage } from '../utils/storage';

export function useAuth() {
  const { state, dispatch, addToast } = useAppContext();
  const { token } = state;

  useEffect(() => {
    const savedToken = storage.getToken();
    if (savedToken && !token) {
      dispatch({ type: 'SET_TOKEN', payload: savedToken });
    }
  }, [dispatch, token]);

  const login = useCallback(
    async (username, password) => {
      try {
        const response = await authApi.login(username, password);
        const { token: newToken, user_id, username: userName } = response.data;
        storage.setToken(newToken);
        storage.setUserId(user_id);
        storage.setUsername(userName);
        dispatch({ type: 'SET_TOKEN', payload: newToken });
        dispatch({ type: 'CLEAR_ERROR' });
        addToast('success', 'Welcome back!');
        return response.data;
      } catch (err) {
        const message = err.response?.data?.error || 'Login failed. Please check your credentials.';
        dispatch({ type: 'SET_ERROR', payload: message });
        throw err;
      }
    },
    [dispatch, addToast]
  );

  const register = useCallback(
    async (username, password) => {
      try {
        await authApi.register(username, password);
        addToast('success', 'Account created! Please sign in.');
        return true;
      } catch (err) {
        const message = err.response?.data?.error || 'Registration failed. Please try again.';
        dispatch({ type: 'SET_ERROR', payload: message });
        throw err;
      }
    },
    [dispatch, addToast]
  );

  const logout = useCallback(() => {
    storage.clearAll();
    dispatch({ type: 'LOGOUT' });
    addToast('info', 'You have been signed out.');
  }, [dispatch, addToast]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  return {
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    error: state.error,
    loading: state.loading,
    dispatch,
    clearError,
  };
}
