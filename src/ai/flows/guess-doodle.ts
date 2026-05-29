// This is an AI-powered doodle guesser that calls the /api/guess endpoint
// It takes a data URI of a doodle and returns the AI's guess.

'use server';

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

    // Call the API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photoDataUri: input.photoDataUri,
      }),
    });

    const data = await response.json();

    // Check if the response contains an error
    if (!response.ok || data.error) {
      return {
        error: data.error || 'Failed to process the doodle',
        code: data.code || 'UNKNOWN_ERROR',
        details: data.details,
      };
    }

    return {
      guess: data.guess,
    };
  } catch (error: any) {
    console.error('Error in guessDoodle:', error);

    return {
      error: 'Failed to process the doodle',
      code: 'UNKNOWN_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    };
  }
}
