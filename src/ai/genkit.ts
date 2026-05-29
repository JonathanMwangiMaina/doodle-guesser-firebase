import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Validate API key exists
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_GENAI_API_KEY is not configured.');
  console.error('📝 Please set this environment variable in:');
  console.error('   - Local development: .env.local file');
  console.error('   - Vercel: Project Settings → Environment Variables');
  console.error('   - Get your key from: https://aistudio.google.com/apikey');

  throw new Error(
    'Missing GOOGLE_GENAI_API_KEY environment variable. ' +
    'Please configure it in your environment. ' +
    'See VERCEL_SETUP.md for deployment instructions.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

console.log('✅ Genkit initialized successfully with Google AI');
