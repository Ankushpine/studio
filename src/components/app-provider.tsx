
'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { MoodLog, JournalEntry, Habit } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';

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
      return { ...state, moodLogs: [action.payload, ...state.moodLogs] };
    case 'ADD_JOURNAL_ENTRY':
      return { ...state, journalEntries: [action.payload, ...state.journalEntries] };
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

async function addHabitToDB(habit: Habit) {
  await setDoc(doc(db, 'habits', habit.id), habit);
}

async function updateHabitInDB(habit: Habit) {
  await setDoc(doc(db, 'habits', habit.id), habit, { merge: true });
}

async function deleteHabitFromDB(habitId: string) {
  await deleteDoc(doc(db, 'habits', habitId));
}

async function addJournalEntryToDB(entry: JournalEntry) {
  await setDoc(doc(db, 'journalEntries', entry.id), {
    ...entry,
    date: entry.date.toISOString(),
  });
}

async function addMoodLogToDB(log: MoodLog) {
  await setDoc(doc(db, 'moodLogs', log.id), {
    ...log,
    date: log.date.toISOString(),
  });
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function fetchData() {
      try {
        const moodLogsQuery = query(collection(db, 'moodLogs'), orderBy('date', 'desc'));
        const moodLogsSnapshot = await getDocs(moodLogsQuery);
        const moodLogs = moodLogsSnapshot.docs.map(doc => {
          const data = doc.data();
          return { ...data, id: doc.id, date: new Date(data.date) } as MoodLog;
        });
        dispatch({ type: 'SET_MOOD_LOGS', payload: moodLogs });

        const journalEntriesQuery = query(collection(db, 'journalEntries'), orderBy('date', 'desc'));
        const journalEntriesSnapshot = await getDocs(journalEntriesQuery);
        const journalEntries = journalEntriesSnapshot.docs.map(doc => {
          const data = doc.data();
          return { ...data, id: doc.id, date: new Date(data.date) } as JournalEntry;
        });
        dispatch({ type: 'SET_JOURNAL_ENTRIES', payload: journalEntries });
        
        const habitsSnapshot = await getDocs(collection(db, 'habits'));
        const habits = habitsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Habit);
        dispatch({ type: 'SET_HABITS', payload: habits });
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    fetchData();
  }, []);


  const enhancedDispatch = async (action: AppAction) => {
    // Optimistic UI update
    dispatch(action);

    try {
      switch (action.type) {
        case 'ADD_HABIT':
          await addHabitToDB(action.payload);
          break;
        case 'UPDATE_HABIT':
          await updateHabitInDB(action.payload);
          break;
        case 'TOGGLE_HABIT':
            const habitToToggle = state.habits.find(h => h.id === action.payload.id);
            if(habitToToggle) {
                await updateHabitInDB({ ...habitToToggle, completed: action.payload.completed });
            }
          break;
        case 'DELETE_HABIT':
          await deleteHabitFromDB(action.payload);
          break;
        case 'ADD_JOURNAL_ENTRY':
          await addJournalEntryToDB(action.payload);
          break;
        case 'ADD_MOOD_LOG':
          await addMoodLogToDB(action.payload);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Firestore write operation failed:", error);
      // Here you might want to dispatch an action to revert the state
    }
  };

  if (state.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch: enhancedDispatch as React.Dispatch<AppAction> }}>
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
