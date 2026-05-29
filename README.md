# 🎨 Doodle Guesser

An AI-powered web application that uses Hugging Face's BLIP image captioning model to guess what you're drawing in real-time. Built with Next.js and TypeScript - **no API key required!**

## Features

- **Real-time Drawing Canvas**: Interactive HTML5 canvas for creating doodles
- **AI-Powered Recognition**: Uses Hugging Face's BLIP image captioning model for accurate guessing
- **Professional Error Handling**: Comprehensive error messages with specific error codes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Health Check API**: Monitor application configuration status
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **AI Integration**: Direct REST API calls to Hugging Face Inference API
- **AI Model**: Salesforce BLIP Image Captioning Large
- **API Endpoint**: `/api/guess` for doodle recognition
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Dependencies**: Zero AI-related packages (pure REST API)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- **No API key required!** (Optional: Hugging Face token for higher rate limits)

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

3. **Set up environment variables (OPTIONAL)**
   ```bash
   cp .env.local.example .env.local
   ```
   The app works without any API key! Optionally add a Hugging Face token for higher rate limits:
   ```
   HUGGINGFACE_API_KEY=your_hf_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### ✅ Works Out of the Box!

**The AI doodle guessing works immediately after deployment - no API key configuration needed!**

### Quick Deployment Steps

1. **Deploy to Vercel**
   ```bash
   vercel
   ```

2. **Optional: Add Hugging Face Token for Higher Rate Limits**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `HUGGINGFACE_API_KEY` with your token from [Hugging Face](https://huggingface.co/settings/tokens)
   - Select all environments (Production, Preview, Development)
   - This is **optional** - the app works without it!

3. **Done!**
   Your app is live and fully functional. No redeploy needed unless you added the optional API key.

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
│   │   ├── api/
│   │   │   ├── guess/           # Hugging Face AI endpoint
│   │   │   └── health/          # Health check endpoint
│   │   └── page.tsx             # Main drawing interface
│   ├── ai/
│   │   └── flows/
│   │       └── guess-doodle.ts  # Server action for doodle guessing
│   ├── components/
│   │   ├── canvas.tsx           # Drawing canvas component
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       └── config.ts            # Centralized configuration
├── .env.local.example           # Environment template
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## Error Handling

The application includes comprehensive error handling with specific error codes:

- **MODEL_LOADING**: Hugging Face model is warming up (first request only)
- **AUTH_ERROR**: Invalid or expired API key (only if using optional token)
- **QUOTA_ERROR**: API quota exceeded
- **INVALID_INPUT**: Invalid drawing data
- **UNKNOWN_ERROR**: Unexpected errors

### Troubleshooting

If you see "AI model is loading":
- This is normal on first request - the model needs a few seconds to warm up
- Simply try again after 5-10 seconds
- Subsequent requests will be fast

If you see quota errors:
- The free Hugging Face API has rate limits
- Add a free Hugging Face token to `.env.local` for higher limits
- Get one at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

## Security Best Practices

- Environment variables are never committed to version control
- API keys are stored securely in Vercel environment variables
- Client-side code never exposes sensitive credentials
- `.env.local` is gitignored by default

## Free Tier Limits

Hugging Face Inference API (without token):
- Works without any account or API key
- Reasonable rate limits for personal projects
- Model may have cold start on first request

With free Hugging Face token:
- 1000+ requests per day
- Faster model loading
- No credit card required
- Perfect for testing and portfolio projects

## Development

### Testing the AI

The app works immediately without any configuration:
1. Run `npm run dev`
2. Draw something simple (e.g., a cat, house, or sun)
3. Click "Guess Doodle!" and see the AI's prediction

### Testing Error States

To test error handling:
1. Temporarily modify the API endpoint URL to an invalid one
2. Draw something and click "Guess Doodle!"
3. Observe the user-friendly error message

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Developed by **Johnsberg** - Built with fun and AI ✨

## Acknowledgments

- Hugging Face for free AI model hosting
- Salesforce for the BLIP image captioning model
- Vercel for hosting and deployment
- shadcn/ui for beautiful components