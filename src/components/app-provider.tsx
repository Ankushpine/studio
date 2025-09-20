
'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { MoodLog, JournalEntry, Habit } from '@/lib/types';
import { initialHabits, initialJournalEntries, initialMoodLogs } from '@/lib/data';

interface AppState {
  moodLogs: MoodLog[];
  journalEntries: JournalEntry[];
  habits: Habit[];
  loading: boolean;
}

type AppAction =
  | { type: 'SET_MOOD_LOGS'; payload: MoodLog[] }
  | { type: 'SET_JOURNAL_ENTRIES'; payload: JournalEntry[] }
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_MOOD_LOG'; payload: MoodLog }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'TOGGLE_HABIT'; payload: { id: string; completed: boolean } }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  moodLogs: [],
  journalEntries: [],
  habits: [],
  loading: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MOOD_LOGS':
      return { ...state, moodLogs: action.payload };
    case 'SET_JOURNAL_ENTRIES':
      return { ...state, journalEntries: action.payload };
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'ADD_MOOD_LOG':
      return { ...state, moodLogs: [action.payload, ...state.moodLogs].sort((a, b) => b.date.getTime() - a.date.getTime()) };
    case 'ADD_JOURNAL_ENTRY':
      return { ...state, journalEntries: [action.payload, ...state.journalEntries].sort((a, b) => b.date.getTime() - a.date.getTime()) };
    case 'TOGGLE_HABIT':
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.payload.id ? { ...habit, completed: action.payload.completed } : habit
        ),
      };
    case 'ADD_HABIT':
      return { ...state, habits: [action.payload, ...state.habits] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.payload.id ? action.payload : habit
        ),
      };
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter((habit) => habit.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate fetching data
    setTimeout(() => {
      dispatch({ type: 'SET_MOOD_LOGS', payload: initialMoodLogs });
      dispatch({ type: 'SET_JOURNAL_ENTRIES', payload: initialJournalEntries });
      dispatch({ type: 'SET_HABITS', payload: initialHabits });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 500);
  }, []);

  if (state.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
