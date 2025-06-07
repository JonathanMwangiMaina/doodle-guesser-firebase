// This is an AI-powered doodle guesser.
// It takes a data URI of a doodle and returns the AI's guess.
// - guessDoodle - A function that handles the doodle guessing process.
// - GuessDoodleInput - The input type for the guessDoodle function.
// - GuessDoodleOutput - The return type for the guessDoodle function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuessDoodleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a doodle, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GuessDoodleInput = z.infer<typeof GuessDoodleInputSchema>;

const GuessDoodleOutputSchema = z.object({
  guess: z.string().describe('The AI model guess of what the doodle is.'),
});
export type GuessDoodleOutput = z.infer<typeof GuessDoodleOutputSchema>;

export async function guessDoodle(input: GuessDoodleInput): Promise<GuessDoodleOutput> {
  return guessDoodleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guessDoodlePrompt',
  input: {schema: GuessDoodleInputSchema},
  output: {schema: GuessDoodleOutputSchema},
  prompt: `You are an AI model that is good at guessing doodles.

  A user has drawn a doodle, and you need to guess what the doodle is. Be as accurate as possible.

  Here is the doodle:
  {{media url=photoDataUri}}

  What is your guess?`,
});

const guessDoodleFlow = ai.defineFlow(
  {
    name: 'guessDoodleFlow',
    inputSchema: GuessDoodleInputSchema,
    outputSchema: GuessDoodleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
