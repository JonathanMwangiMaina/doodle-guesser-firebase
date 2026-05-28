// Simple end-to-end test for the AI doodle guessing functionality
import { guessDoodle } from './src/ai/flows/guess-doodle.ts';

// Create a simple test image (1x1 red pixel as base64 PNG)
const testImageDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

console.log('Testing AI doodle guessing functionality...');
console.log('API Key configured:', process.env.GOOGLE_GENAI_API_KEY ? 'Yes' : 'No');

try {
  const result = await guessDoodle({ photoDataUri: testImageDataUri });
  console.log('✅ TEST PASSED');
  console.log('AI Response:', result);
  process.exit(0);
} catch (error) {
  console.error('❌ TEST FAILED');
  console.error('Error:', error.message);
  process.exit(1);
}
