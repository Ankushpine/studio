'use client';

import { useState } from 'react';
import { useApp } from './app-provider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
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
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BookHeart, Feather, Sparkles } from 'lucide-react';
import { getJournalPrompt } from '@/lib/actions';
import { format } from 'date-fns';

export function JournalClient() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  const handleGeneratePrompt = async () => {
    setIsPromptLoading(true);
    try {
        const latestMood = state.moodLogs[0]?.mood || 'neutral';
        const prompt = await getJournalPrompt({ userMood: latestMood });
        setContent(prompt);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate a prompt. Please try again."
        });
    } finally {
        setIsPromptLoading(false);
    }
  };

  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Entry',
        description: 'Please provide both a title and content for your journal entry.',
      });
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date(),
    };

    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: newEntry });
    toast({
      title: 'Entry Saved',
      description: 'Your journal entry has been successfully saved.',
    });

    setTitle('');
    setContent('');
    setIsDialogOpen(false);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">My Journal</CardTitle>
            <CardDescription>A space for your private thoughts and reflections.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Feather className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle className="font-headline">New Journal Entry</DialogTitle>
                <DialogDescription>
                  Write about your day, your thoughts, or use a prompt to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  id="title"
                  placeholder="Entry Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
                <div className="relative">
                  <Textarea
                    id="content"
                    placeholder="Start writing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] pr-12"
                  />
                   <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleGeneratePrompt}
                    disabled={isPromptLoading}
                    className="absolute bottom-2 right-2 h-8 w-8"
                    aria-label="Generate writing prompt"
                   >
                     <Sparkles className={`h-4 w-4 ${isPromptLoading ? 'animate-pulse' : ''}`}/>
                   </Button>
                </div>
                 <Button variant="outline" onClick={handleGeneratePrompt} disabled={isPromptLoading}>
                    <Sparkles className={`mr-2 h-4 w-4 ${isPromptLoading ? 'animate-pulse' : ''}`}/>
                    {isPromptLoading ? 'Generating...' : 'Suggest a writing prompt'}
                 </Button>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveEntry}>Save Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {state.journalEntries.length === 0 ? (
         <Card className="flex flex-col items-center justify-center p-12 text-center">
            <BookHeart className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-headline text-xl font-semibold">Your Journal is Empty</h3>
            <p className="text-muted-foreground">Start by creating your first entry.</p>
         </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.journalEntries.map((entry) => (
            <Card key={entry.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline truncate">{entry.title}</CardTitle>
                <CardDescription>{format(new Date(entry.date), 'MMMM d, yyyy')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-4 text-sm text-muted-foreground">{entry.content}</p>
              </CardContent>
              <CardFooter>
                 <Button variant="link" className="p-0 h-auto">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
