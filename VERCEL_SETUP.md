# Vercel Deployment Setup Guide

This guide explains how to properly configure the Doodle Guesser app for Vercel deployment.

## Prerequisites

1. A Google AI API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. A Vercel account

## Environment Variable Configuration

The app requires the `GOOGLE_GENAI_API_KEY` environment variable to function.

### Option 1: Vercel Dashboard (Recommended)

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter the following details:
   - **Name**: `GOOGLE_GENAI_API_KEY`
   - **Value**: Your Google AI API key (starts with `AIza...`)
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. Redeploy your application

### Option 2: Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Add environment variable
vercel env add GOOGLE_GENAI_API_KEY

# When prompted:
# - Enter your API key
# - Select environments (Production, Preview, Development)

# Redeploy
vercel --prod
```

### Option 3: During Initial Deployment

When deploying for the first time, Vercel will prompt you to add environment variables if it detects `.env.local.example`.

## Verifying the Configuration

After adding the environment variable and redeploying:

1. Visit your deployed app
2. Draw something on the canvas
3. Click "Guess my doodle"
4. The AI should return a guess

If you see errors:
- **"AI service is not configured properly"**: Environment variable is missing
- **"API authentication failed"**: API key is invalid
- **"Service quota exceeded"**: You've hit the free tier limit

## Troubleshooting

### Error: "Environment Variable 'GOOGLE_GENAI_API_KEY' references Secret..."

This error appears if your `vercel.json` has:
```json
{
  "env": {
    "GOOGLE_GENAI_API_KEY": "@google_genai_api_key"
  }
}
```

**Solution**: Remove the `env` section from `vercel.json`. Environment variables should be configured via the Vercel dashboard or CLI, not in the config file.

### Build Succeeds but AI Fails

1. Check environment variable is set for the correct environment (Production/Preview)
2. Verify the API key is valid at [Google AI Studio](https://aistudio.google.com/apikey)
3. Check API quota hasn't been exceeded
4. View deployment logs in Vercel dashboard for specific errors

### Local Development

For local development:
1. Copy `.env.local.example` to `.env.local`
2. Add your API key to `.env.local`
3. Run `npm run dev`

**Important**: Never commit `.env.local` to version control!

## Security Best Practices

- ✅ Store API keys in environment variables
- ✅ Use Vercel's environment variable system
- ✅ Never commit API keys to Git
- ✅ Rotate API keys periodically
- ❌ Don't hardcode API keys in source code
- ❌ Don't use Vercel Secrets syntax (`@secret_name`) in `vercel.json`

## Getting a Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Select or create a Google Cloud project
5. Copy the generated key (starts with `AIza...`)
6. Store it securely in your environment variables

## Free Tier Limits

Google AI Studio free tier includes:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

For production apps with higher traffic, consider upgrading to a paid plan.

## Support

If you encounter issues:
1. Check the [Next.js deployment docs](https://nextjs.org/docs/deployment)
2. Review [Genkit documentation](https://firebase.google.com/docs/genkit)
3. Check [Vercel environment variables guide](https://vercel.com/docs/concepts/projects/environment-variables)
