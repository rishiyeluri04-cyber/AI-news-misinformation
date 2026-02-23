# 🚀 Deploying TruthLens to Vercel

## What's Being Deployed
- **Frontend**: Next.js 14 (React + Tailwind CSS) — `nextapp/`
- **Backend**: Python serverless API functions — `nextapp/api/`
- **Platform**: Vercel (free tier works!)

---

## Step 1 — Install Vercel CLI

Open PowerShell and run:
```bash
npm install -g vercel
```

---

## Step 2 — Login to Vercel

```bash
vercel login
```
Choose "Continue with GitHub" or email. A browser window will open.

---

## Step 3 — Initialize Git (if not already done)

```bash
cd nextapp
git init
git add .
git commit -m "Initial commit: TruthLens Next.js + React + Tailwind"
```

---

## Step 4 — Deploy to Vercel

```bash
cd nextapp
vercel
```

When prompted:
- **Set up and deploy**: `Y`
- **Which scope**: Your personal account
- **Link to existing project**: `N`
- **Project name**: `truthlens` (or any name you like)
- **Is the source code in the root?**: `Y`
- **Override build command**: `N` (uses `npm run build`)
- **Override output directory**: `N` (uses `.next`)

---

## Step 5 — Add Environment Variables (Optional)

If you want to move the Gemini API key out of the code:

1. Go to https://vercel.com/dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Add: `GEMINI_API_KEY` = `YOUR_GEMINI_API_KEY`
4. Then update `backend/gemini_analyzer.py`:
   ```python
   GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
   ```

---

## Step 6 — Production Deploy

After the first deploy, every future push deploys automatically:
```bash
vercel --prod
```

Or connect to GitHub for automatic deployments on every push.

---

## Local Development

1. Start Flask backend:
```bash
cd backend
python app.py
```

2. Start Next.js frontend (in a new terminal):
```bash
cd nextapp
npm run dev
```

3. Open http://localhost:3000

The Next.js dev server automatically proxies `/api/*` calls to `http://localhost:5000`.

---

## Architecture Summary

```
Vercel Deployment
├── nextapp/
│   ├── src/app/           → Next.js pages (React + Tailwind CSS)
│   ├── api/
│   │   ├── predict.py     → POST /api/predict  (Python serverless, 60s timeout)
│   │   ├── status.py      → GET  /api/status   (Python serverless)
│   │   └── metrics.py     → GET  /api/metrics  (Python serverless)
│   └── vercel.json        → Vercel configuration
└── backend/
    ├── predictor.py       → ML model inference
    ├── gemini_analyzer.py → Gemini AI analysis
    └── models/            → Trained .joblib files (committed to repo)
```
