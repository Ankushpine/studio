'use client';

import { useState } from 'react';
import { useApp } from './app-provider';
import type { Mood } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Laugh, Smile, Meh, Frown, Angry } from 'lucide-react';
import { format } from 'date-fns';

const moods: { name: Mood; icon: React.ElementType }[] = [
  { name: 'ecstatic', icon: Laugh },
  { name: 'happy', icon: Smile },
  { name: 'neutral', icon: Meh },
  { name: 'sad', icon: Frown },
  { name: 'anxious', icon: Angry },
];

export function MoodTrackerClient() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState('');

  const today = new Date();
  const todayString = today.toDateString();
  const hasLoggedToday = state.moodLogs.some(
    log => new Date(log.date).toDateString() === todayString
  );
  
  const latestLog = state.moodLogs[0];


  const handleSaveMood = () => {
    if (!selectedMood) {
      toast({
        variant: 'destructive',
        title: 'No Mood Selected',
        description: 'Please select a mood before saving.',
      });
      return;
    }

    const newLog = {
      id: Date.now().toString(),
      mood: selectedMood,
      notes,
      date: new Date(),
    };

    dispatch({ type: 'ADD_MOOD_LOG', payload: newLog });
    toast({
      title: 'Mood Logged',
      description: `Your mood has been logged as ${selectedMood}.`,
    });

    setSelectedMood(null);
    setNotes('');
  };

  if (hasLoggedToday) {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline">Mood Logged for Today</CardTitle>
                    <CardDescription>You've already logged your mood for {format(today, "MMMM d, yyyy")}. Come back tomorrow!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Today's mood: <span className="font-semibold capitalize">{state.moodLogs.find(log => new Date(log.date).toDateString() === todayString)?.mood}</span></p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-headline text-center text-2xl">How are you feeling?</CardTitle>
          <CardDescription className="text-center">
            Select an emotion that best describes your current state.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-around">
            {moods.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant="ghost"
                className={cn(
                  'h-20 w-20 flex-col gap-2 rounded-full border-2 transition-all duration-300',
                  selectedMood === name
                    ? 'border-primary bg-primary/10 scale-110'
                    : 'border-transparent'
                )}
                onClick={() => setSelectedMood(name)}
              >
                <Icon
                  className={cn('h-8 w-8', selectedMood === name ? 'text-primary' : 'text-muted-foreground')}
                />
                <span className="capitalize text-xs">{name}</span>
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Add a note about why you're feeling this way... (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSaveMood} disabled={!selectedMood}>
            Save Mood
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
