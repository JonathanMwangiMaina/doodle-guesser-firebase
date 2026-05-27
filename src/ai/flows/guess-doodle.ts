// This is an AI-powered doodle guesser.
// It takes a data URI of a doodle and returns the AI's guess.
// - guessDoodle - A function that handles the doodle guessing process.
// - GuessDoodleInput - The input type for the guessDoodle function.
// - GuessDoodleOutput - The return type for the guessDoodle function.

'use server';

import { z } from 'zod';

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
  const { photoDataUri } = GuessDoodleInputSchema.parse(input);

  try {
    const prompt = `You are an AI model that is good at guessing doodles.

A user has drawn a doodle, and you need to guess what the doodle is. Be as accurate as possible.

What is your guess? Respond with just the object name or a short phrase, nothing else.`;

    // Call Subscribe.dev API
    // Using Claude 4.5 Sonnet for excellent vision capabilities
    const apiKey = process.env.SUBSCRIBE_DEV_API_KEY;

    if (!apiKey) {
      throw new Error('SUBSCRIBE_DEV_API_KEY environment variable is not set. Please add it to your .env.local file.');
    }

    const response = await fetch('https://api.subscribe.dev/v1/run_image_ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-4.5-sonnet',
        input: {
          prompt: prompt,
          input_image: photoDataUri,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Subscribe.dev API error:', response.status, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('API Response:', JSON.stringify(result, null, 2));

    // Extract guess from the response
    let guess = 'Unknown';

    if (result.output && Array.isArray(result.output) && result.output.length > 0) {
      guess = result.output[0].trim();
    } else if (typeof result.output === 'string') {
      guess = result.output.trim();
    } else if (result.text) {
      guess = result.text.trim();
    } else if (result.content) {
      guess = result.content.trim();
    } else if (result.message && typeof result.message === 'string') {
      guess = result.message.trim();
    }

    return {
      guess: guess || 'Unknown'
    };
  } catch (error) {
    console.error('Error guessing doodle:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get AI guess: ${error.message}`);
    }
    throw new Error('Failed to get AI guess. Please try again.');
  }
}
