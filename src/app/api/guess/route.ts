import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { photoDataUri } = await req.json();

    // Validate API key
    const API_KEY = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        {
          error: 'AI service is not configured properly',
          code: 'CONFIG_ERROR',
          details: 'Please contact the administrator to configure the API key',
        },
        { status: 500 }
      );
    }

    // Validate input
    if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
      return NextResponse.json(
        {
          error: 'Invalid image data provided',
          code: 'INVALID_INPUT',
          details: 'The image data must be a valid data URI',
        },
        { status: 400 }
      );
    }

    // Extract base64 data and mime type from data URI
    const matches = photoDataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json(
        {
          error: 'Invalid data URI format',
          code: 'INVALID_INPUT',
          details: 'Could not parse the image data URI',
        },
        { status: 400 }
      );
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

    // Call Gemini API with image
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);

      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error: 'API authentication failed',
            code: 'AUTH_ERROR',
            details: 'Invalid or expired API key',
          },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'AI service quota exceeded',
            code: 'QUOTA_ERROR',
            details: 'Please try again later',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to process the doodle',
          code: 'UNKNOWN_ERROR',
          details: errorData.error?.message || 'Unknown error occurred',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the guess from the response
    const guess = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!guess) {
      return NextResponse.json(
        {
          error: 'No response from AI',
          code: 'UNKNOWN_ERROR',
          details: 'AI did not return a valid response',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ guess });
  } catch (error: any) {
    console.error('Error in guess API:', error);

    return NextResponse.json(
      {
        error: 'Failed to process the doodle',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
