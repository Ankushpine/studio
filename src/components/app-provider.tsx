
'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { MoodLog, JournalEntry, Habit, HabitCompletion } from '@/lib/types';
import { initialHabits, initialJournalEntries, initialMoodLogs, initialHabitCompletions } from '@/lib/data';
import { format } from 'date-fns';

interface AppState {
  moodLogs: MoodLog[];
  journalEntries: JournalEntry[];
  habits: Habit[];
  habitCompletions: HabitCompletion[];
  loading: boolean;
}

type AppAction =
  | { type: 'SET_MOOD_LOGS'; payload: MoodLog[] }
  | { type: 'SET_JOURNAL_ENTRIES'; payload: JournalEntry[] }
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'SET_HABIT_COMPLETIONS'; payload: HabitCompletion[] }
  | { type: 'ADD_MOOD_LOG'; payload: MoodLog }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'TOGGLE_HABIT'; payload: { habitId: string; date: string; completed: boolean } }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  moodLogs: [],
  journalEntries: [],
  habits: [],
  habitCompletions: [],
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
    case 'SET_HABIT_COMPLETIONS':
        return { ...state, habitCompletions: action.payload };
    case 'ADD_MOOD_LOG':
      return { ...state, moodLogs: [action.payload, ...state.moodLogs].sort((a, b) => b.date.getTime() - a.date.getTime()) };
    case 'ADD_JOURNAL_ENTRY':
      return { ...state, journalEntries: [action.payload, ...state.journalEntries].sort((a, b) => b.date.getTime() - a.date.getTime()) };
    case 'TOGGLE_HABIT': {
        const { habitId, date, completed } = action.payload;
        const existingCompletion = state.habitCompletions.find(c => c.habitId === habitId && c.date === date);

        if (existingCompletion) {
            return {
                ...state,
                habitCompletions: state.habitCompletions.map(c =>
                    c.habitId === habitId && c.date === date ? { ...c, completed } : c
                ),
            };
        } else {
            return {
                ...state,
                habitCompletions: [...state.habitCompletions, { habitId, date, completed }],
            };
        }
    }
    case 'ADD_HABIT': {
        const newHabit = action.payload;
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const newCompletion: HabitCompletion = {
            habitId: newHabit.id,
            date: todayStr,
            completed: false,
        };
        return {
            ...state,
            habits: [newHabit, ...state.habits],
            habitCompletions: [...state.habitCompletions, newCompletion],
        };
    }
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.payload.id ? action.payload : habit
        ),
      };
    case 'DELETE_HABIT': {
      const habitIdToDelete = action.payload;
      return {
        ...state,
        habits: state.habits.filter((habit) => habit.id !== habitIdToDelete),
        habitCompletions: state.habitCompletions.filter(c => c.habitId !== habitIdToDelete),
      };
    }
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
      dispatch({ type: 'SET_HABIT_COMPLETIONS', payload: initialHabitCompletions });
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
