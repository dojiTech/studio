'use server';

/**
 * @fileOverview AI agent that suggests similar tasks based on a given task.
 *
 * - suggestSimilarTasks - A function that suggests similar tasks.
 * - SuggestSimilarTasksInput - The input type for the suggestSimilarTasks function.
 * - SuggestSimilarTasksOutput - The output type for the suggestSimilarTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarTasksInputSchema = z.object({
  taskName: z.string().describe('The name of the task to find similar tasks for.'),
});
export type SuggestSimilarTasksInput = z.infer<typeof SuggestSimilarTasksInputSchema>;

const SuggestSimilarTasksOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of similar task suggestions based on the input task name.'),
});
export type SuggestSimilarTasksOutput = z.infer<typeof SuggestSimilarTasksOutputSchema>;

export async function suggestSimilarTasks(input: SuggestSimilarTasksInput): Promise<SuggestSimilarTasksOutput> {
  return suggestSimilarTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSimilarTasksPrompt',
  input: {schema: SuggestSimilarTasksInputSchema},
  output: {schema: SuggestSimilarTasksOutputSchema},
  prompt: `You are a helpful assistant that suggests similar tasks based on a given task name.

  Given the task name: {{{taskName}}}

  Suggest a list of similar tasks that a user might want to add to their to-do list. Return the suggestions as a JSON array of strings.
  `,
});

const suggestSimilarTasksFlow = ai.defineFlow(
  {
    name: 'suggestSimilarTasksFlow',
    inputSchema: SuggestSimilarTasksInputSchema,
    outputSchema: SuggestSimilarTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
