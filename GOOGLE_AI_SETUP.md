# Google AI API Configuration Guide

## The Problem: Why AI Guessing Fails in Vercel

When you deploy to Vercel, the application fails to guess doodles because the **`GOOGLE_GENAI_API_KEY`** environment variable is not available in the serverless function environment. This is a common deployment configuration issue where build-time and runtime environment contexts differ.

## The Solution: Configure Environment Variables in Vercel

### Step 1: Get Your Free Google AI API Key

1. Visit: **https://aistudio.google.com/apikey**
2. Click **"Create API Key"** button
3. Select **"Create API key in new project"**
4. Copy the generated key immediately (it won't be shown again)

**Free Tier Details:**
- ✅ 60 requests per minute
- ✅ No credit card required
- ✅ Perfect for testing and personal projects
- ✅ Gemini 2.0 Flash model included

### Step 2: Add to Vercel Deployment

#### **Option A: Via Vercel Dashboard (Recommended)**

1. Navigate to your project: https://vercel.com/dashboard
2. Select the **doodle-guesser-firebase** project
3. Go to **Settings** tab → **Environment Variables** (left sidebar)
4. Click **"Add New"** button
5. Fill in the form:
   - **Name:** `GOOGLE_GENAI_API_KEY`
   - **Value:** Paste your API key from Step 1
   - **Environments:** Check all three boxes:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
6. Click **"Save"** button
7. You'll see confirmation: "Environment variable added"

#### **Option B: Via Vercel CLI**

```bash
# First, ensure you're logged in
vercel login

# Add the environment variable
vercel env add GOOGLE_GENAI_API_KEY

# When prompted, paste your Google AI API key
# The CLI will ask which environments to add it to - select all

# Redeploy with the new environment variable
vercel --prod
```

### Step 3: Redeploy Your Application

**Via Dashboard:**
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **"..."** menu on the right
4. Select **"Redeploy"**
5. Leave settings as-is, click **"Redeploy"** again
6. Wait for build to complete (usually 1-2 minutes)

**Via CLI:**
```bash
vercel --prod
```

### Step 4: Verify Deployment Success

**Check Build Logs:**
1. After redeployment starts, click on the deployment in the Deployments tab
2. Scroll to see build logs
3. Look for: `✅ Genkit initialized successfully with Google AI`

**Test in Production:**
1. Visit your Vercel URL (e.g., `https://doodle-guesser-firebase.vercel.app`)
2. Draw a simple shape (circle, square, triangle, star, etc.)
3. Click **"Guess Doodle!"** button
4. Wait 1-2 seconds for AI response
5. You should see the AI's guess in a modal: `🎨 "circle"`

## Troubleshooting

### Symptom: "The AI service needs to be configured"

**Cause:** Environment variable not set in Vercel

**Solution:**
1. Go to Vercel Settings → Environment Variables
2. Verify `GOOGLE_GENAI_API_KEY` is listed
3. Check that it's set for all three environments (Production, Preview, Development)
4. If missing, add it and redeploy
5. Wait 2-3 minutes for the new deployment to complete

### Symptom: Build succeeds but AI still doesn't work

**Cause:** Environment variable not properly propagated

**Solution:**
```bash
# Force a fresh rebuild
vercel --prod --force

# Or via dashboard: delete the environment variable and re-add it
```

### Symptom: "Service quota exceeded"

**Cause:** Exceeded 60 requests/minute on free tier

**Solution:**
- Wait 1 minute and try again
- For production, upgrade to [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai) with higher quotas

### Symptom: Build fails with error about missing dependency

**Cause:** Potential timeout or network issue

**Solution:**
```bash
# Verify locally
npm install
npm run build

# If successful locally, retry deployment
vercel --prod
```

## How It Works: The Complete Flow

```
1. You add GOOGLE_GENAI_API_KEY to Vercel Environment Variables
   ↓
2. Vercel includes it in the serverless function environment
   ↓
3. Node.js process.env.GOOGLE_GENAI_API_KEY is available
   ↓
4. src/ai/genkit.ts reads the key and initializes Google AI plugin
   ↓
5. User draws doodle and clicks "Guess Doodle!"
   ↓
6. Client calls guessDoodle() server action
   ↓
7. Gemini 2.0 Flash model analyzes image and returns guess
   ↓
8. UI displays: 🎨 "apple"
```

## Best Practices

### Security ✅

- ✅ API key stored only in Vercel Environment Variables (not in code)
- ✅ Different keys for dev/staging/production (optional but recommended)
- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Monitor API usage at https://aistudio.google.com/apikey

### Performance ✅

- ✅ Gemini 2.0 Flash: Ultra-fast inference (~1-2 seconds)
- ✅ Vercel Edge Network: Global CDN distribution
- ✅ Next.js 15.3: Optimized build and runtime
- ✅ Server actions: Reduced client-side code

### Monitoring ✅

```bash
# View deployment logs
vercel logs --follow

# Watch for errors in function logs
# Deployments → Details → Function Logs tab
```

## Next Steps: Production Scale

For production beyond free tier:

1. **Upgrade to Google Cloud Vertex AI**
   - Higher quotas (1000+ req/min)
   - 99.9% SLA
   - Cost based on usage

2. **Implement Caching**
   - Store frequent guesses
   - Reduce API calls
   - Faster response times

3. **Add Analytics**
   - Track popular doodles
   - Monitor error rates
   - Identify patterns

4. **Rate Limiting**
   - Prevent abuse
   - Fair quota distribution
   - Graceful degradation

## Reference Links

- 📚 [Google AI Studio](https://aistudio.google.com/apikey)
- 🚀 [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- 🤖 [Genkit Documentation](https://firebase.google.com/docs/genkit)
- ✨ [Gemini API Guide](https://ai.google.dev/docs)

---

**Status:** This configuration transforms your app from development-only to fully production-ready. The AI guessing will work seamlessly once the environment variable is set.
