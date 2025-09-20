'use server';

import {
  generateJournalPrompt as generateJournalPromptFlow,
  type JournalPromptInput,
} from '@/ai/flows/journal-prompt-generation';
import {
  supportiveChatbotConversation as supportiveChatbotConversationFlow,
  type SupportiveChatbotConversationInput,
} from '@/ai/flows/supportive-chatbot-conversation';

export async function getJournalPrompt(
  input: JournalPromptInput
): Promise<string> {
  try {
    const { prompt } = await generateJournalPromptFlow(input);
    return prompt;
  } catch (error) {
    console.error('Error generating journal prompt:', error);
    throw new Error('Failed to generate journal prompt.');
  }
}

export async function getChatbotResponse(
  input: SupportiveChatbotConversationInput
): Promise<string> {
  try {
    const { response } = await supportiveChatbotConversationFlow(input);
    return response;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw new Error('Failed to get chatbot response.');
  }
}
