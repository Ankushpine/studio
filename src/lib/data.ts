
import type { MoodLog, JournalEntry, Habit, MindfulnessExercise } from './types';
import { subDays } from 'date-fns';

export const initialMoodLogs: MoodLog[] = [];

export const initialJournalEntries: JournalEntry[] = [];

export const initialHabits: Habit[] = [];

export const mindfulnessExercises: MindfulnessExercise[] = [
  {
    id: '1',
    title: 'Deep Breathing Exercise',
    category: 'Breathing',
    description: `1. Find a comfortable, quiet place to sit or lie down.
2. Close your eyes gently.
3. Inhale slowly through your nose for a count of four. Feel your belly expand.
4. Hold your breath for a count of four.
5. Exhale slowly through your mouth for a count of six.
6. Repeat for 5-10 minutes.`,
    imageUrl: 'exercise-1',
  },
  {
    id: '2',
    title: '5-4-3-2-1 Grounding Technique',
    category: 'Grounding',
    description: `This technique helps bring you back to the present moment. Acknowledge:
- 5 things you can see.
- 4 things you can feel.
- 3 things you can hear.
- 2 things you can smell.
- 1 thing you can taste.`,
    imageUrl: 'exercise-2',
  },
  {
    id: '3',
    title: 'Mindful Observation',
    category: 'Observation',
    description: `Pick an object in your environment, like a plant or a pen.
Observe it as if you are seeing it for the first time.
Notice its colors, textures, shape, and weight.
Let your senses explore every detail without judgment.
This practice helps anchor you in the present.`,
    imageUrl: 'exercise-3',
  },
  {
    id: '4',
    title: 'Body Scan Meditation',
    category: 'Meditation',
    description: `1. Lie down on your back with your legs uncrossed and arms by your sides.
2. Close your eyes and bring your attention to your body.
3. Start with your toes. Notice any sensations without judgment.
4. Slowly move your attention up your body: feet, legs, torso, arms, hands, neck, and head.
5. Spend a few moments on each body part, simply noticing how it feels.`,
    imageUrl: 'exercise-4',
  },
];
