# Migration from Genkit to Subscribe.dev

This document describes the migration from Google Genkit with Gemini API to Subscribe.dev's AI API.

## Changes Made

### 1. Updated AI Flow Implementation

**File:** `src/ai/flows/guess-doodle.ts`

- Removed Genkit framework dependencies
- Replaced with direct HTTP API call to Subscribe.dev
- Maintained the same TypeScript interfaces (GuessDoodleInput, GuessDoodleOutput)
- Kept Zod validation for input/output
- Maintained 'use server' directive for Next.js server action compatibility

### 2. Removed Files

- `src/ai/genkit.ts` - Genkit configuration file
- `src/ai/dev.ts` - Genkit development server file

### 3. Updated package.json

**Removed Dependencies:**
- @genkit-ai/googleai
- @genkit-ai/next
- genkit

**Removed DevDependencies:**
- genkit-cli

**Removed Scripts:**
- genkit:dev
- genkit:watch

### 4. Added Environment Variable Configuration

**File:** `.env.local.example`

Required environment variable:
```
SUBSCRIBE_DEV_API_KEY=your_api_key_here
```

## Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Subscribe.dev API key from https://subscribe.dev

3. Add your API key to `.env.local`:
   ```
   SUBSCRIBE_DEV_API_KEY=your_actual_api_key
   ```

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## API Details

The new implementation uses:
- **Endpoint:** `https://api.subscribe.dev/v1/run_image_ai`
- **Model:** `anthropic/claude-4.5-sonnet` (excellent vision capabilities for doodle recognition)
- **Authentication:** Bearer token via `SUBSCRIBE_DEV_API_KEY`

### Request Format

```json
{
  "model": "anthropic/claude-4.5-sonnet",
  "input": {
    "prompt": "You are an AI model that is good at guessing doodles...",
    "input_image": "data:image/png;base64,<base64_encoded_image>"
  }
}
```

### Response Format

The API returns a JSON object with the AI's response. The implementation handles multiple response formats:
- `result.output[0]` (array format)
- `result.output` (string format)
- `result.text` field
- `result.content` field
- `result.message` field

Defaults to 'Unknown' if no recognized format is returned.

## Benefits of Migration

1. **Improved AI Model** - Uses Claude 4.5 Sonnet with excellent vision capabilities
2. **Simpler Setup** - Single API key vs. complex Genkit + Google Cloud credentials
3. **Reduced Dependencies** - Removed 342 packages (from 735 to 393 packages)
4. **Direct API Control** - More transparent and easier to debug
5. **Maintained Functionality** - Same user-facing behavior and TypeScript types
6. **No Google Cloud Setup** - No need for Google Cloud project or service account

## Compatibility

The migration maintains full compatibility with the existing UI code:
- Same function signature: `guessDoodle(input: GuessDoodleInput): Promise<GuessDoodleOutput>`
- Same input format: `{ photoDataUri: string }`
- Same output format: `{ guess: string }`
- Works with existing Next.js server actions

## Troubleshooting

If you encounter errors:

1. **API Key Issues:**
   - Ensure `SUBSCRIBE_DEV_API_KEY` is set in `.env.local`
   - Verify the API key is valid
   - Check that `.env.local` is not in `.gitignore` (it should be)

2. **API Request Failures:**
   - Check console logs for detailed error messages
   - Verify internet connectivity
   - Ensure the Subscribe.dev service is accessible

3. **Image Format Issues:**
   - The API expects data URIs in format: `data:image/png;base64,<data>`
   - Ensure the canvas is exporting images correctly
