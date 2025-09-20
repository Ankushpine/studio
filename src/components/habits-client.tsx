
'use client';

import { useState, useMemo } from 'react';
import { useApp } from './app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Habit } from '@/lib/types';
import { Calendar } from './ui/calendar';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

export function HabitsClient() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitName, setHabitName] = useState('');

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  const habitsForSelectedDate = useMemo(() => {
    return state.habits.map(habit => {
      const completion = state.habitCompletions.find(c => c.habitId === habit.id && c.date === selectedDateStr);
      return { ...habit, completed: completion ? completion.completed : false };
    });
  }, [state.habits, state.habitCompletions, selectedDateStr]);

  const completedHabits = habitsForSelectedDate.filter((h) => h.completed).length;
  const totalHabits = habitsForSelectedDate.length;
  const progress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  const handleHabitToggle = (habitId: string, checked: boolean) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: { habitId, date: selectedDateStr, completed: checked } });
  };

  const handleOpenForm = (habit: Habit | null = null) => {
    setEditingHabit(habit);
    setHabitName(habit ? habit.name : '');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
    setHabitName('');
  };

  const handleSaveHabit = () => {
    if (!habitName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Habit name cannot be empty.',
      });
      return;
    }

    if (editingHabit) {
      dispatch({
        type: 'UPDATE_HABIT',
        payload: { ...editingHabit, name: habitName },
      });
      toast({ title: 'Habit Updated', description: 'Your habit has been successfully updated.' });
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitName,
      };
      dispatch({ type: 'ADD_HABIT', payload: newHabit });
      toast({ title: 'Habit Added', description: 'Your new habit has been successfully added.' });
    }
    handleCloseForm();
  };

  const handleDeleteHabit = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
    toast({ title: 'Habit Deleted', description: 'The habit has been removed.' });
  };

  const canEditHabits = isToday(selectedDate || new Date());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Habit Tracker</CardTitle>
              <CardDescription>
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : 'Today'}
              </CardDescription>
            </div>
             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenForm()} disabled={!canEditHabits}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Habit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">
                    {editingHabit ? 'Edit Habit' : 'New Habit'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingHabit ? 'Update the name of your habit.' : 'Add a new habit to track daily.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    id="habit-name"
                    placeholder="e.g., Meditate for 10 minutes"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveHabit}>Save Habit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {completedHabits} / {totalHabits} completed
                  </span>
                </div>
                <Progress value={progress} aria-label={`${Math.round(progress)}% of habits completed`} />
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                {habitsForSelectedDate.length > 0 ? (
                  habitsForSelectedDate.map((habit) => (
                    <div key={habit.id} className="flex items-center group">
                      <Checkbox
                        id={`habit-${habit.id}-${selectedDateStr}`}
                        checked={habit.completed}
                        onCheckedChange={(checked) => handleHabitToggle(habit.id, !!checked)}
                        className="h-5 w-5"
                        disabled={!canEditHabits}
                      />
                      <Label
                        htmlFor={`habit-${habit.id}-${selectedDateStr}`}
                        className={cn("ml-3 text-base font-medium flex-1", canEditHabits && "cursor-pointer")}
                      >
                        {habit.name}
                      </Label>
                      {canEditHabits && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenForm(habit)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit habit</span>
                           </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteHabit(habit.id)}>
                               <Trash2 className="h-4 w-4" />
                               <span className="sr-only">Delete habit</span>
                           </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No habits yet. Add one to get started!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent className="p-0">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
