'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { MoodLog, JournalEntry, Habit } from '@/lib/types';
import { initialHabits, initialJournalEntries, initialMoodLogs } from '@/lib/data';

interface AppState {
  moodLogs: MoodLog[];
  journalEntries: JournalEntry[];
  habits: Habit[];
}

type AppAction =
  | { type: 'ADD_MOOD_LOG'; payload: MoodLog }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'TOGGLE_HABIT'; payload: { id: string; completed: boolean } }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string };

const initialState: AppState = {
  moodLogs: initialMoodLogs,
  journalEntries: initialJournalEntries,
  habits: initialHabits,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_MOOD_LOG':
      return {
        ...state,
        moodLogs: [action.payload, ...state.moodLogs],
      };
    case 'ADD_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: [action.payload, ...state.journalEntries],
      };
    case 'TOGGLE_HABIT':
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.payload.id ? { ...habit, completed: action.payload.completed } : habit
        ),
      };
    case 'ADD_HABIT':
      return {
        ...state,
        habits: [action.payload, ...state.habits],
      };
    case 'UPDATE_HABIT':
        return {
            ...state,
            habits: state.habits.map((habit) =>
                habit.id === action.payload.id ? action.payload : habit
            ),
        };
    case 'DELETE_HABIT':
        return {
            ...state,
            habits: state.habits.filter((habit) => habit.id !== action.payload),
        };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
