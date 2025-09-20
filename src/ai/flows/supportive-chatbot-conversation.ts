'use server';
/**
 * @fileOverview An AI chatbot that provides supportive and empathetic conversation.
 *
 * - supportiveChatbotConversation - A function that handles the chatbot conversation.
 * - SupportiveChatbotConversationInput - The input type for the supportiveChatbotConversation function.
 * - SupportiveChatbotConversationOutput - The return type for the supportiveChatbotConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportiveChatbotConversationInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({role: z.enum(['user', 'assistant']), content: z.string()})).optional().describe('The chat history between the user and the chatbot.')
});
export type SupportiveChatbotConversationInput = z.infer<typeof SupportiveChatbotConversationInputSchema>;

const SupportiveChatbotConversationOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type SupportiveChatbotConversationOutput = z.infer<typeof SupportiveChatbotConversationOutputSchema>;

export async function supportiveChatbotConversation(input: SupportiveChatbotConversationInput): Promise<SupportiveChatbotConversationOutput> {
  return supportiveChatbotConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportiveChatbotConversationPrompt',
  input: {
    schema: SupportiveChatbotConversationInputSchema,
  },
  output: {
    schema: SupportiveChatbotConversationOutputSchema,
  },
  prompt: `You are a supportive and empathetic AI chatbot designed to provide assistance and understanding to users struggling with their mental well-being.

  Your goal is to offer a safe space for users to express their feelings and provide helpful responses.
  Maintain a conversational tone and use active listening skills to understand the user's needs.
  Avoid giving medical advice and instead encourage users to seek professional help when necessary.
  Acknowledge the user's feelings and validate their experiences.
  Use positive and encouraging language to uplift the user's mood.
  Offer practical suggestions and resources to help the user cope with their challenges.
  Keep responses short and to the point, never respond with more than 2 sentences.

  Here is the chat history:
  {{#if chatHistory}}
  {{#each chatHistory}}
  {{this.role}}: {{{this.content}}}
  {{/each}}
  {{/if}}

  User: {{{message}}}
  Chatbot: `,
});

const supportiveChatbotConversationFlow = ai.defineFlow(
  {
    name: 'supportiveChatbotConversationFlow',
    inputSchema: SupportiveChatbotConversationInputSchema,
    outputSchema: SupportiveChatbotConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
