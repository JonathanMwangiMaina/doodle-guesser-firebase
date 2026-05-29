import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate API key exists
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_GENAI_API_KEY is not configured.');
  console.error('📝 Please set this environment variable in:');
  console.error('   - Local development: .env.local file');
  console.error('   - Vercel: Project Settings → Environment Variables');
  console.error('   - Get your key from: https://aistudio.google.com/apikey');

  throw new Error(
    'Missing GOOGLE_GENAI_API_KEY environment variable. ' +
    'Please configure it in your environment. ' +
    'See GOOGLE_AI_SETUP.md for deployment instructions.'
  );
}

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(apiKey);

// Get the Gemini 2.0 Flash model
export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
});

console.log('✅ Google AI initialized successfully with Gemini 2.0 Flash');
