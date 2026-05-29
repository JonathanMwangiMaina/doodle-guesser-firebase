# 🎨 Doodle Guesser

An AI-powered web application that uses Google's Gemini 2.0 Flash model to guess what you're drawing in real-time. Built with Next.js, TypeScript, and Google's Generative AI SDK.

## Features

- **Real-time Drawing Canvas**: Interactive HTML5 canvas for creating doodles
- **AI-Powered Recognition**: Uses Google's Gemini 2.0 Flash model for accurate guessing
- **Professional Error Handling**: Comprehensive error messages with specific error codes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Health Check API**: Monitor application configuration status
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **AI Integration**: Google Generative AI SDK (@google/generative-ai)
- **AI Model**: Gemini 2.0 Flash Experimental
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google AI API key ([Get one here](https://aistudio.google.com/apikey))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/JonathanMwangiMaina/doodle-guesser-firebase.git
   cd doodle-guesser-firebase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Google AI API key:
   ```
   GOOGLE_GENAI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### ⚠️ Important: AI Configuration Required

**The AI doodle guessing will NOT work in production without proper environment variable configuration.**

For complete step-by-step deployment instructions including AI setup, see **[GOOGLE_AI_SETUP.md](./GOOGLE_AI_SETUP.md)**.

### Quick Deployment Steps

1. **Deploy to Vercel**
   ```bash
   vercel
   ```

2. **Add Google AI Environment Variable** (Required!)
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `GOOGLE_GENAI_API_KEY` with your API key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Select all environments (Production, Preview, Development)
   - See [GOOGLE_AI_SETUP.md](./GOOGLE_AI_SETUP.md) for detailed instructions

3. **Redeploy**
   ```bash
   vercel --prod
   ```

## API Endpoints

### Health Check
- **Endpoint**: `/api/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "apiKeyConfigured": true
  }
  ```

## Project Structure

```
doodle-guesser-firebase/
├── src/
│   ├── app/
│   │   ├── api/health/          # Health check endpoint
│   │   └── page.tsx             # Main drawing interface
│   ├── ai/
│   │   ├── genkit.ts            # Genkit configuration
│   │   └── flows/
│   │       └── guess-doodle.ts  # AI flow for doodle guessing
│   ├── components/
│   │   ├── canvas.tsx           # Drawing canvas component
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       └── config.ts            # Centralized configuration
├── .env.local.example           # Environment template
├── GOOGLE_AI_SETUP.md           # Complete AI configuration guide
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## Error Handling

The application includes comprehensive error handling with specific error codes:

- **CONFIG_ERROR**: API key not configured
- **AUTH_ERROR**: Invalid or expired API key
- **QUOTA_ERROR**: API quota exceeded
- **INVALID_INPUT**: Invalid drawing data
- **UNKNOWN_ERROR**: Unexpected errors

### Troubleshooting

If you see "The AI service needs to be configured":
1. Ensure `GOOGLE_GENAI_API_KEY` is set in Vercel Environment Variables
2. Verify it's set for all environments (Production, Preview, Development)
3. Redeploy the application
4. Check build logs for: `✅ Genkit initialized successfully with Google AI`

See [GOOGLE_AI_SETUP.md](./GOOGLE_AI_SETUP.md#troubleshooting) for more troubleshooting steps.

## Security Best Practices

- Environment variables are never committed to version control
- API keys are stored securely in Vercel environment variables
- Client-side code never exposes sensitive credentials
- `.env.local` is gitignored by default

## Free Tier Limits

Google AI Studio free tier:
- 60 requests per minute
- No credit card required
- Perfect for testing and personal projects

For production use, consider upgrading to [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai).

## Development

### Environment Validation

The app includes automatic environment validation on startup. If the `GOOGLE_GENAI_API_KEY` is missing, you'll see helpful error messages with setup instructions.

### Testing Error States

To test error handling:
1. Remove or invalidate your API key
2. Draw something and click "Guess Doodle!"
3. Observe the user-friendly error message

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Developed by **Johnsberg** - Built with fun and AI ✨

## Acknowledgments

- Google Gemini AI for powerful image recognition
- Firebase Genkit for seamless AI integration
- Vercel for hosting and deployment
- shadcn/ui for beautiful components