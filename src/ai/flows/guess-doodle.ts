// This is an AI-powered doodle guesser using Google's Generative AI SDK.
// It takes a data URI of a doodle and returns the AI's guess.

'use server';

import { model } from '@/ai/gemini';

export interface GuessDoodleInput {
  photoDataUri: string;
}

export interface GuessDoodleOutput {
  guess: string;
  confidence?: string;
}

interface GuessDoodleError {
  error: string;
  code: string;
  details?: string;
}

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

    // Extract the base64 data and mime type from the data URI
    const matches = input.photoDataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return {
        error: 'Invalid data URI format',
        code: 'INVALID_INPUT',
        details: 'Could not parse the image data URI',
      };
    }

    const [, mimeType, base64Data] = matches;

    // Create the prompt for Gemini
    const prompt = `You are an expert AI at identifying hand-drawn doodles and sketches.

A user has drawn a doodle, and you need to guess what it represents.
Be creative but reasonable with your guess. Consider common objects, animals, symbols, and concepts.

Analyze the doodle image provided and give your best guess of what this doodle represents.
Be specific and confident. If you're unsure, provide your most likely guess based on the shapes and patterns you see.

Respond with ONLY the name of what you think the doodle is (e.g., "cat", "house", "tree", "smiley face").
Do not include explanations or additional text.`;

    // Generate content with the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const response = result.response;
    const guess = response.text().trim();

    return {
      guess,
    };
  } catch (error: any) {
    console.error('Error in guessDoodle:', error);

    // Check for specific error types
    if (error.message?.includes('GOOGLE_GENAI_API_KEY') || error.message?.includes('GOOGLE_API_KEY')) {
      return {
        error: 'AI service is not configured properly',
        code: 'CONFIG_ERROR',
        details: 'Please contact the administrator to configure the API key',
      };
    }

    if (error.message?.includes('API key') || error.message?.includes('invalid key')) {
      return {
        error: 'API authentication failed',
        code: 'AUTH_ERROR',
        details: 'Invalid or expired API key',
      };
    }

    if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
      return {
        error: 'AI service quota exceeded',
        code: 'QUOTA_ERROR',
        details: 'Please try again later',
      };
    }

    if (error.message?.includes('safety') || error.message?.includes('blocked')) {
      return {
        error: 'Content was blocked by safety filters',
        code: 'SAFETY_ERROR',
        details: 'The image may have triggered content safety filters',
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
