import { useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { tasksApi, recommendationApi, profileApi } from '../utils/api';

export function useTasks() {
  const { state, dispatch, addToast } = useAppContext();
  const { token, tasks, recommendation, user } = state;

  const fetchAll = useCallback(async () => {
    if (!token) return;
    dispatch({ type: 'LOAD_TASKS_START' });
    try {
      const [tasksRes, recRes, profileRes] = await Promise.all([
        tasksApi.getAll(),
        recommendationApi.get(),
        profileApi.get(),
      ]);
      dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: tasksRes.data.tasks });
      dispatch({ type: 'FETCH_RECOMMENDATION_SUCCESS', payload: recRes.data });
      dispatch({ type: 'SET_USER', payload: profileRes.data });
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to load data';
      dispatch({ type: 'LOAD_TASKS_ERROR', payload: message });
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token, fetchAll]);

  const completeTask = useCallback(
    async (taskId) => {
      dispatch({ type: 'COMPLETE_TASK_START' });
      try {
        await tasksApi.complete(taskId);
        addToast('success', 'Task marked complete!');
        await fetchAll();
        dispatch({ type: 'COMPLETE_TASK_SUCCESS' });
      } catch (err) {
        const message = err.response?.data?.error || 'Error completing task';
        dispatch({ type: 'SET_ERROR', payload: message });
        addToast('error', message);
      }
    },
    [dispatch, addToast, fetchAll]
  );

  const resetTasks = useCallback(async () => {
    dispatch({ type: 'RESET_TASKS_START' });
    try {
      await tasksApi.reset();
      addToast('success', 'All tasks have been reset. Starting fresh!');
      await fetchAll();
      dispatch({ type: 'RESET_TASKS_SUCCESS' });
    } catch (err) {
      const message = err.response?.data?.error || 'Error resetting tasks';
      dispatch({ type: 'SET_ERROR', payload: message });
      addToast('error', message);
    }
  }, [dispatch, addToast, fetchAll]);

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const progress = user ? user.progress : 0;

  return {
    tasks,
    pendingTasks,
    completedTasks,
    recommendation,
    progress,
    loading: state.loading,
    error: state.error,
    completeTask,
    resetTasks,
    refresh: fetchAll,
  };
}
