# Deployment Guide - Doodle Guesser

## Overview

This application is a Next.js 15 application that uses Firebase Genkit and Google Gemini 2.0 Flash for AI-powered doodle recognition. This guide covers deployment to Vercel.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Google AI API key from [Google AI Studio](https://aistudio.google.com/apikey)
- Vercel account (for deployment)

## Environment Variables

The application requires the following environment variable:

### `GOOGLE_GENAI_API_KEY`

**Required:** Yes
**Description:** API key for Google Gemini AI model
**Where to get it:** https://aistudio.google.com/apikey

## Local Development

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/JonathanMwangiMaina/doodle-guesser-firebase.git
cd doodle-guesser-firebase
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
GOOGLE_GENAI_API_KEY=your_google_api_key_here
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:9002 (configured in package.json).

### 4. Build for Production

```bash
npm run build
```

### 5. Test Production Build Locally

```bash
npm start
```

## Deploying to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variable:**
   ```bash
   vercel env add GOOGLE_GENAI_API_KEY
   ```
   When prompted, paste your Google AI API key.

5. **Redeploy with Environment Variable:**
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard (Web UI)

1. **Connect Repository:**
   - Go to https://vercel.com/new
   - Import your GitHub repository: `JonathanMwangiMaina/doodle-guesser-firebase`
   - Click "Import"

2. **Configure Project:**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Add Environment Variables:**
   - In the project settings, go to "Environment Variables"
   - Add a new variable:
     - **Name:** `GOOGLE_GENAI_API_KEY`
     - **Value:** Your Google AI API key
     - **Environments:** Production, Preview, Development (select all)
   - Click "Save"

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application

## Configuration Files

### `vercel.json`

The project includes a `vercel.json` configuration file:

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "GOOGLE_GENAI_API_KEY": "@google_genai_api_key"
  }
}
```

This configuration:
- Specifies build commands
- References the environment variable from Vercel's environment settings
- Ensures proper Next.js framework detection

### `next.config.ts`

Key configurations in `next.config.ts`:

```typescript
{
  typescript: {
    ignoreBuildErrors: true  // Allows build to complete with type warnings
  },
  eslint: {
    ignoreDuringBuilds: true  // Skips ESLint during production builds
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),  // Ensures @ path alias works
    };
    return config;
  }
}
```

## Build Process

The production build process:

1. **TypeScript Compilation:** Next.js automatically installs TypeScript if not present
2. **Route Generation:** Static pages are pre-rendered
3. **Bundle Optimization:** JavaScript bundles are minified and optimized
4. **Asset Processing:** Images and static assets are optimized

Expected build output:
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    13.1 kB         127 kB
└ ○ /_not-found                            977 B         102 kB
+ First Load JS shared by all             101 kB
```

## Troubleshooting

### Build Fails with "Module not found" Errors

**Solution:** The `next.config.ts` includes webpack alias configuration. Ensure the file has the webpack configuration as shown above.

### AI Requests Fail with Authentication Error

**Symptoms:**
- Canvas works, but "Guess" button fails
- Console shows API authentication errors

**Solution:**
1. Verify `GOOGLE_GENAI_API_KEY` is set correctly in Vercel environment variables
2. Check that the API key is valid at https://aistudio.google.com/apikey
3. Ensure the environment variable is enabled for the correct environment (Production/Preview/Development)
4. Redeploy after adding environment variables

### TypeScript Installation Issues During Build

**Solution:** Next.js 15.3.3 automatically installs TypeScript during build if missing. This is normal behavior and not an error.

### OpenTelemetry Warning

You may see this warning during build:
```
Module not found: Can't resolve '@opentelemetry/exporter-jaeger'
```

**This is safe to ignore.** It's a peer dependency warning from Genkit's telemetry system and doesn't affect application functionality.

## Security Best Practices

1. **Never commit API keys:** Always use `.env.local` for local development
2. **Use Vercel environment variables:** Store secrets in Vercel's encrypted environment variable system
3. **Rotate API keys regularly:** Update your Google AI API key periodically
4. **Monitor API usage:** Check your Google AI Studio dashboard for unusual activity

## Monitoring and Logs

### Vercel Deployment Logs

View deployment logs in Vercel Dashboard:
1. Go to your project in Vercel
2. Click on "Deployments"
3. Select a deployment to view build logs

### Runtime Logs

View application logs:
1. Go to your project in Vercel
2. Click on "Logs" tab
3. Filter by time range and log level

### Google AI API Usage

Monitor API usage:
1. Go to https://aistudio.google.com/
2. Check your API key usage and quotas
3. Set up billing alerts if needed

## Performance Optimization

The application is optimized for production:

- **Static Generation:** Homepage is pre-rendered at build time
- **Code Splitting:** JavaScript bundles are split for optimal loading
- **Image Optimization:** Next.js Image component provides automatic optimization
- **Server Actions:** AI processing happens on the server for security

## Dependencies

### Core Dependencies

- `next@15.3.3` - React framework
- `react@^18.3.1` - UI library
- `genkit@^1.36.0` - AI orchestration framework
- `@genkit-ai/googleai@^1.28.0` - Google AI integration
- `@genkit-ai/next@^1.36.0` - Next.js integration for Genkit
- `firebase@^11.8.1` - Firebase SDK
- `zod@^3.24.2` - Schema validation

### UI Dependencies

- `@radix-ui/*` - Accessible UI components
- `lucide-react@^0.475.0` - Icon library
- `tailwindcss@^3.4.1` - CSS framework

## Version Compatibility

- Node.js: 18.x or higher
- npm: 8.x or higher
- Next.js: 15.3.3
- React: 18.3.1
- TypeScript: 5.9.3

## Support

For issues or questions:
- GitHub Repository: https://github.com/JonathanMwangiMaina/doodle-guesser-firebase
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Firebase Genkit Documentation: https://genkit.dev/docs

## License

See LICENSE file in the repository root.
