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

const GuessDoodleOutputSchema = z.object({
  guess: z.string().describe('The AI model guess of what the doodle is.'),
  confidence: z.string().optional().describe('Confidence level of the guess'),
});

// Add error schema
const GuessDoodleErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
  details: z.string().optional(),
});

export type GuessDoodleInput = z.infer<typeof GuessDoodleInputSchema>;
export type GuessDoodleOutput = z.infer<typeof GuessDoodleOutputSchema>;
type GuessDoodleError = z.infer<typeof GuessDoodleErrorSchema>;

export async function guessDoodle(
  input: GuessDoodleInput
): Promise<GuessDoodleOutput | GuessDoodleError> {
  try {
    // Validate input
    if (!input.photoDataUri || !input.photoDataUri.startsWith('data:image/')) {
      return {
        error: 'Invalid image data provided',
        code: 'INVALID_INPUT',
        details: 'The image data must be a valid data URI',
      };
    }

    const result = await guessDoodleFlow(input);
    return result;
  } catch (error: any) {
    console.error('Error in guessDoodle:', error);

    // Check for specific error types
    if (error.message?.includes('GOOGLE_GENAI_API_KEY')) {
      return {
        error: 'AI service is not configured properly',
        code: 'CONFIG_ERROR',
        details: 'Please contact the administrator to configure the API key',
      };
    }

    if (error.message?.includes('API key')) {
      return {
        error: 'API authentication failed',
        code: 'AUTH_ERROR',
        details: 'Invalid or expired API key',
      };
    }

    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return {
        error: 'AI service quota exceeded',
        code: 'QUOTA_ERROR',
        details: 'Please try again later',
      };
    }

    // Generic error
    return {
      error: 'Failed to process the doodle',
      code: 'UNKNOWN_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    };
  }
}

const prompt = ai.definePrompt({
  name: 'guessDoodlePrompt',
  input: {schema: GuessDoodleInputSchema},
  output: {schema: GuessDoodleOutputSchema},
  prompt: `You are an expert AI at identifying hand-drawn doodles and sketches.

A user has drawn a doodle, and you need to guess what it represents.
Be creative but reasonable with your guess. Consider common objects, animals, symbols, and concepts.

Here is the doodle image: {{media url=photoDataUri}}

Provide your best guess of what this doodle represents. Be specific and confident.
If you're unsure, provide your most likely guess based on the shapes and patterns you see.

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
