'use client';

import { useApp } from './app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, BookHeart, CheckSquare, Smile } from 'lucide-react';
import { useEffect, useState } from 'react';

const quotes = [
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill" },
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

export function DashboardClient() {
  const { state } = useApp();
  const [hasLoggedMoodToday, setHasLoggedMoodToday] = useState(false);
  const [quote, setQuote] = useState<{quote: string; author: string} | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    setHasLoggedMoodToday(state.moodLogs.some(
      (log) => new Date(log.date).toDateString() === today
    ));

    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setQuote(quotes[dayOfYear % quotes.length]);
  }, [state.moodLogs]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Welcome to your Zenith Journal</CardTitle>
          <CardDescription>
            Your personal space for reflection and growth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Today is a new day. Take a moment for yourself.
          </p>
        </CardContent>
      </Card>

      {quote && (
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
              <CardTitle className="font-headline text-lg">Quote of the Day</CardTitle>
          </CardHeader>
          <CardContent>
              <blockquote className="border-l-4 border-primary pl-4 italic">
                  "{quote.quote}"
              </blockquote>
              <p className="mt-2 text-right text-sm text-muted-foreground">- {quote.author}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {!hasLoggedMoodToday && (
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Smile /> How are you?
              </CardTitle>
              <CardDescription>Log your mood for today.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <Button asChild className="w-full">
                <Link href="/mood-tracker">Log Mood <ArrowRight className="ml-2" /></Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BookHeart />
              Journal
            </CardTitle>
            <CardDescription>Write down your thoughts.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            <Button asChild className="w-full">
              <Link href="/journal">Open Journal <ArrowRight className="ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <CheckSquare />
              Habits
            </CardTitle>
            <CardDescription>Check in on your habits.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            <Button asChild className="w-full">
              <Link href="/habits">Track Habits <ArrowRight className="ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
