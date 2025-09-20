'use client';

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mindfulnessExercises } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ExercisesClient() {
  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };
  
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
      <Accordion type="single" collapsible className="w-full">
        {mindfulnessExercises.map((exercise, index) => {
          const imageData = exercise.imageUrl ? getImage(exercise.imageUrl) : undefined;
          return (
            <AccordionItem value={`item-${index}`} key={exercise.id}>
              <AccordionTrigger className="font-headline text-lg hover:no-underline">
                {exercise.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {imageData && (
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={imageData.imageUrl}
                        alt={imageData.description}
                        fill
                        className="object-cover"
                        data-ai-hint={imageData.imageHint}
                      />
                    </div>
                  )}
                  <div className={imageData ? "" : "md:col-span-2"}>
                    <p className="text-muted-foreground whitespace-pre-wrap">{exercise.description}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
