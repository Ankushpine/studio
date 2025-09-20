import type { MoodLog, JournalEntry, Habit, MindfulnessExercise } from './types';
import { subDays } from 'date-fns';

export const initialMoodLogs: MoodLog[] = [
  { id: '1', mood: 'happy', notes: 'Had a great day at work.', date: subDays(new Date(), 1) },
  { id: '2', mood: 'neutral', notes: 'A pretty standard day.', date: subDays(new Date(), 2) },
  { id: '3', mood: 'sad', notes: 'Feeling a bit down.', date: subDays(new Date(), 3) },
  { id: '4', mood: 'happy', notes: 'Met up with an old friend.', date: subDays(new Date(), 4) },
  { id: '5', mood: 'ecstatic', notes: 'Got some amazing news!', date: subDays(new Date(), 5) },
  { id: '6', mood: 'neutral', notes: 'Relaxing at home.', date: subDays(new Date(), 6) },
  { id: '7', mood: 'anxious', notes: 'Stressed about the upcoming week.', date: subDays(new Date(), 7) },
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'A Good Day',
    content: 'Today was a really good day. I felt productive and happy. I managed to finish a big project at work and received positive feedback. It feels great to have that weight off my shoulders. I should celebrate this small win.',
    date: subDays(new Date(), 1),
  },
  {
    id: '2',
    title: 'Reflections on Friendship',
    content: 'Met up with Sarah today. It has been a while. We talked for hours, and it felt like no time had passed. It is so important to cherish these connections. I feel grateful to have her in my life.',
    date: subDays(new Date(), 4),
  },
];

export const initialHabits: Habit[] = [
  { id: '1', name: 'Meditate for 10 minutes', completed: true },
  { id: '2', name: 'Go for a 30-minute walk', completed: false },
  { id: '3', name: 'Drink 8 glasses of water', completed: true },
  { id: '4', name: 'Read a chapter of a book', completed: false },
  { id: '5', name: 'Get 15 minutes of sunlight', completed: true },
];

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
  {
    id: '5',
    title: 'Loving-Kindness Meditation',
    category: 'Meditation',
    description: `1. Sit comfortably and close your eyes.
2. Bring to mind someone you care about deeply.
3. Silently repeat phrases like: "May you be happy. May you be healthy. May you be safe."
4. Extend these wishes to yourself, then to a neutral person, and finally to all living beings.`,
    imageUrl: 'exercise-5',
  },
  {
    id: '6',
    title: 'Mindful Walking',
    category: 'Movement',
    description: `1. Find a space where you can walk back and forth.
2. Walk at a slow, natural pace.
3. Pay attention to the sensation of your feet touching the ground.
4. Notice the movement in your legs and the rest of your body.
5. When your mind wanders, gently bring it back to the sensation of walking.`,
    imageUrl: 'exercise-6',
  },
  {
    id: '7',
    title: 'Mindful Eating',
    category: 'Observation',
    description: `1. Take a piece of food, like a raisin or a slice of fruit.
2. Look at it as if you've never seen it before. Notice its texture and color.
3. Smell it. What do you notice?
4. Place it in your mouth but don't chew yet. Notice the sensations.
5. Chew slowly, paying attention to the taste and texture.
6. Swallow and notice the sensation of the food moving down your throat.`,
    imageUrl: 'exercise-7',
  },
];
