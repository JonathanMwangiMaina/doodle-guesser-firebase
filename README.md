# 🎨 Doodle Guesser

An AI-powered web application that uses Google's Gemini 2.0 Flash model to guess what you're drawing in real-time. Built with Next.js, TypeScript, and Firebase Genkit.

## Features

- **Real-time Drawing Canvas**: Interactive HTML5 canvas for creating doodles
- **AI-Powered Recognition**: Uses Google's Gemini 2.0 Flash model for accurate guessing
- **Professional Error Handling**: Comprehensive error messages with specific error codes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Health Check API**: Monitor application configuration status
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **AI Integration**: Firebase Genkit with Google AI
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
   git clone <your-repo-url>
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

For detailed deployment instructions, see [VERCEL_SETUP.md](./VERCEL_SETUP.md).

### Quick Deployment Steps

1. **Deploy to Vercel**
   ```bash
   vercel
   ```

2. **Add Environment Variable**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `GOOGLE_GENAI_API_KEY` with your API key
   - Select all environments (Production, Preview, Development)

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
├── VERCEL_SETUP.md             # Deployment guide
└── README.md                    # This file
```

## Error Handling

The application includes comprehensive error handling with specific error codes:

- **CONFIG_ERROR**: API key not configured
- **AUTH_ERROR**: Invalid or expired API key
- **QUOTA_ERROR**: API quota exceeded
- **INVALID_INPUT**: Invalid drawing data
- **UNKNOWN_ERROR**: Unexpected errors

## Security Best Practices

- Environment variables are never committed to version control
- API keys are stored securely in Vercel environment variables
- Client-side code never exposes sensitive credentials
- `.env.local` is gitignored by default

## Development

### Environment Validation

The app includes automatic environment validation on startup. If the `GOOGLE_GENAI_API_KEY` is missing, you'll see helpful error messages with setup instructions.

### Testing Error States

To test error handling:
1. Remove or invalidate your API key
2. Draw something and click "Guess Doodle!"
3. Observe the user-friendly error message

## Free Tier Limits

Google AI Studio free tier:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

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
