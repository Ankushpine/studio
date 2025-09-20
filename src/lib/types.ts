export type Mood = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'anxious';

export type MoodLog = {
  id: string;
  mood: Mood;
  notes?: string;
  date: Date;
};

export type JournalEntry = {
  id:string;
  title: string;
  content: string;
  date: Date;
};

export type Habit = {
  id: string;
  name: string;
};

export type HabitCompletion = {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export type MindfulnessExercise = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
};
