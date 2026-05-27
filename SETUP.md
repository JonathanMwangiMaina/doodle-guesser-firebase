# Doodle Guesser Setup Instructions

## Prerequisites
- Node.js installed (v18 or higher)
- Subscribe.dev account

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key

The application now uses Subscribe.dev's AI API instead of Google's Gemini API. You need to set up your Subscribe.dev API key:

#### Get Your API Key:
1. Visit [https://subscribe.dev](https://subscribe.dev)
2. Sign up or log in to your account
3. Create a new project (or use an existing one)
4. Copy your project's API key (starts with `pub_`)

#### Set Up Environment Variable:
1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and replace `your_api_key_here` with your actual API key:
   ```
   SUBSCRIBE_DEV_API_KEY=pub_your_actual_api_key_here
   ```

### 3. Run the Development Server
```bash
npm run dev
```

The application will be available at http://localhost:3000 (or the port shown in your terminal).

## Features

- **AI-Powered Doodle Recognition**: Uses Claude 4.5 Sonnet for accurate doodle guessing
- **Simple Drawing Interface**: 600x400 pixel canvas for easy doodling
- **Instant Feedback**: Get AI guesses in seconds
- **No Complex Setup**: Single API key configuration

## How It Works

1. Draw a doodle on the canvas
2. Click "Guess Doodle!" button
3. The app sends your doodle (as a base64-encoded PNG) to Subscribe.dev's AI API
4. Claude 4.5 Sonnet analyzes the image and returns a guess
5. The guess is displayed in a dialog

## Troubleshooting

### "SUBSCRIBE_DEV_API_KEY environment variable is not set"
- Make sure you created the `.env.local` file
- Verify the API key is correctly set in the file
- Restart the development server after adding the environment variable

### "API request failed"
- Check that your API key is valid
- Ensure you have credits in your Subscribe.dev account
- Check your internet connection

### Application won't start
- Run `npm install` to ensure all dependencies are installed
- Check that port 3000 is not already in use
- Try removing `node_modules` and `.next` folders, then run `npm install` again

## Migration from Genkit

This application previously used Firebase Genkit with Google's Gemini API. It has been migrated to use Subscribe.dev's API directly, offering:

- **Simpler setup**: Single environment variable instead of Google Cloud credentials
- **Better reliability**: Direct API calls without framework overhead
- **Improved AI model**: Claude 4.5 Sonnet provides excellent vision capabilities
- **Reduced dependencies**: 342 fewer npm packages to manage

For more details about the migration, see `MIGRATION.md`.

## Support

If you encounter any issues:
1. Check this SETUP.md file for troubleshooting steps
2. Review the console logs in your browser (F12 → Console tab)
3. Check the terminal output where the dev server is running
4. Visit Subscribe.dev's documentation at https://subscribe.dev/docs

## Next Steps

- Customize the canvas size in `src/app/page.tsx` (lines 55-56)
- Modify the AI prompt in `src/ai/flows/guess-doodle.ts` (lines 29-33)
- Try different AI models (see Subscribe.dev docs for available models)
- Add more features like saving doodles, history, or multiplayer mode

Happy doodling! 🎨
