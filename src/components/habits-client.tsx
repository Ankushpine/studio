'use client';

import { useApp } from './app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';

export function HabitsClient() {
  const { state, dispatch } = useApp();
  
  const completedHabits = state.habits.filter(h => h.completed).length;
  const totalHabits = state.habits.length;
  const progress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  const handleHabitToggle = (habitId: string) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: habitId });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Habit Tracker</CardTitle>
          <CardDescription>
            Cultivate positive routines to support your well-being.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{completedHabits} / {totalHabits} completed</span>
                </div>
                <Progress value={progress} aria-label={`${Math.round(progress)}% of habits completed`} />
             </div>
            <div className="space-y-4 rounded-lg border p-4">
              {state.habits.map((habit) => (
                <div key={habit.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`habit-${habit.id}`}
                    checked={habit.completed}
                    onCheckedChange={() => handleHabitToggle(habit.id)}
                  />
                  <Label
                    htmlFor={`habit-${habit.id}`}
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {habit.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
