/**
 * Centralized configuration and environment validation
 */

export const config = {
  googleAI: {
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
    model: 'googleai/gemini-2.0-flash' as const,
  },
  app: {
    name: 'Doodle Guesser',
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
} as const;

/**
 * Validates that all required environment variables are set
 * Throws descriptive errors if validation fails
 */
export function validateEnvironment(): void {
  const missingVars: string[] = [];

  if (!config.googleAI.apiKey) {
    missingVars.push('GOOGLE_GENAI_API_KEY');
  }

  if (missingVars.length > 0) {
    const errorMessage = [
      '❌ Missing required environment variables:',
      ...missingVars.map(v => `   - ${v}`),
      '',
      '📝 Setup instructions:',
      '   Local: Copy .env.local.example to .env.local and add your keys',
      '   Vercel: Add environment variables in Project Settings',
      '',
      '📚 See VERCEL_SETUP.md for detailed instructions',
    ].join('\n');

    throw new Error(errorMessage);
  }
}

// Validate on module load (but only log in development)
if (config.app.isDevelopment) {
  try {
    validateEnvironment();
    console.log('✅ Environment configuration validated');
  } catch (error) {
    console.error(error);
  }
}
