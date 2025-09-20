'use server';

/**
 * @fileOverview Provides suggested writing prompts for journal entries.
 *
 * - generateJournalPrompt - A function that generates a journal prompt.
 * - JournalPromptInput - The input type for the generateJournalPrompt function.
 * - JournalPromptOutput - The return type for the generateJournalPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalPromptInputSchema = z.object({
  userMood: z
    .string()
    .describe('The current mood of the user. e.g., Happy, Sad, Anxious'),
  journalingGoal: z
    .string()
    .optional()
    .describe(
      'The goal of the user for this journaling session. e.g., process a difficult emotion, plan for the future, or practice gratitude'
    ),
});
export type JournalPromptInput = z.infer<typeof JournalPromptInputSchema>;

const JournalPromptOutputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A suggested writing prompt to help the user start their journal entry.'
    ),
});
export type JournalPromptOutput = z.infer<typeof JournalPromptOutputSchema>;

export async function generateJournalPrompt(
  input: JournalPromptInput
): Promise<JournalPromptOutput> {
  return generateJournalPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalPromptGeneratorPrompt',
  input: {schema: JournalPromptInputSchema},
  output: {schema: JournalPromptOutputSchema},
  prompt: `You are a helpful assistant designed to provide users with engaging journal prompts to help them explore their thoughts and feelings.

  The user is currently feeling: {{{userMood}}}
  {{#if journalingGoal}}
  The user wants to use this journaling session to: {{{journalingGoal}}}
  {{/if}}

  Generate one creative and thought-provoking journal prompt based on the user's current mood and journaling goals.
  The prompt should be open-ended and encourage self-reflection.
  Do not start the prompt with \"Here is a prompt for you:\". Just provide the prompt.
  `,
});

const generateJournalPromptFlow = ai.defineFlow(
  {
    name: 'generateJournalPromptFlow',
    inputSchema: JournalPromptInputSchema,
    outputSchema: JournalPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
