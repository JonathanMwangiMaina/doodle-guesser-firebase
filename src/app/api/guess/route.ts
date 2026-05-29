import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { photoDataUri } = await req.json();

    // Hugging Face API doesn't require an API key for public models
    // But you can optionally use one for higher rate limits
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

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

    // Extract base64 data from data URI
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

    const [, , base64Data] = matches;

    // Convert base64 to blob for Hugging Face API
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Use Salesforce BLIP image captioning model (free, no API key required)
    // Alternative models:
    // - nlpconnect/vit-gpt2-image-captioning
    // - microsoft/git-large-textcaps
    const modelUrl = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if available (optional, for higher rate limits)
    if (HF_API_KEY) {
      headers['Authorization'] = `Bearer ${HF_API_KEY}`;
    }

    // Call Hugging Face Inference API
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers,
      body: imageBuffer,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hugging Face API error:', errorData);

      // Handle specific error cases
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error: 'API authentication failed',
            code: 'AUTH_ERROR',
            details: 'Invalid or missing API key',
          },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'AI service quota exceeded',
            code: 'QUOTA_ERROR',
            details: 'Too many requests. Please try again in a few moments.',
          },
          { status: 429 }
        );
      }

      if (response.status === 503) {
        return NextResponse.json(
          {
            error: 'AI model is loading',
            code: 'MODEL_LOADING',
            details: 'The AI model is warming up. Please try again in a few seconds.',
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to process the doodle',
          code: 'UNKNOWN_ERROR',
          details: errorData || 'Unknown error occurred',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Hugging Face BLIP returns an array of predictions
    // Format: [{ generated_text: "a drawing of a cat" }]
    let guess = '';

    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      guess = data[0].generated_text.trim();

      // Clean up the response to make it more concise
      // BLIP often returns "a photo of..." or "a drawing of..."
      guess = guess
        .replace(/^(a|an|the)\s+(photo|picture|image|drawing|sketch|doodle)\s+of\s+/i, '')
        .replace(/^(a|an|the)\s+/i, '')
        .trim();
    } else {
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
