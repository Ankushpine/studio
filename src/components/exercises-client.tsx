'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mindfulnessExercises } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Search } from 'lucide-react';

const categories = ['All', ...new Set(mindfulnessExercises.map((e) => e.category))];

export function ExercisesClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };

  const filteredExercises = mindfulnessExercises.filter((exercise) => {
    const matchesCategory =
      selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesSearch = exercise.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Mindfulness Library</CardTitle>
          <CardDescription>
            A collection of guided exercises to help you find calm and presence.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {filteredExercises.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => {
              const imageData = exercise.imageUrl ? getImage(exercise.imageUrl) : undefined;
              return (
                <Card key={exercise.id} className="flex flex-col">
                  {imageData && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={imageData.imageUrl}
                        alt={imageData.description}
                        fill
                        className="object-cover"
                        data-ai-hint={imageData.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{exercise.title}</CardTitle>
                    <CardDescription>{exercise.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                      {exercise.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
             <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
             <h3 className="font-headline text-xl font-semibold">No Exercises Found</h3>
             <p className="text-muted-foreground">Try adjusting your search or filter.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
