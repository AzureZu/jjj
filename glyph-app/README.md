# 𓂀 Glyph AI — Ancient Egyptian Hieroglyph Translator

A mobile-first React web app for translating, transcribing, and analyzing ancient Egyptian hieroglyphs using Claude AI and a suite of 5 neural recognition models.

## Deploy to Vercel (3 steps)

1. **Push to GitHub**
   ```bash
   git init && git add . && git commit -m "init"
   gh repo create glyph-ai --public --push
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - Vercel auto-detects Create React App — no config needed

3. **Add Environment Variable** *(optional — users can also enter their key in-app)*
   - In Vercel project → Settings → Environment Variables
   - Add `REACT_APP_ANTHROPIC_API_KEY` = your key

## Local Development

```bash
npm install
cp .env.example .env.local
# Add your API key to .env.local
npm start
```

## Features

- **Translate** — Hieroglyph → English, English → Hieroglyph, Transliterate
- **Transcribe** — MdC, Unicode, Gardiner List, Phonetic formats
- **Image Analysis** — Upload temple/papyrus photos for AI recognition
- **Reference** — Searchable hieroglyph library
- **AI Models** — 5 models with live accuracy metrics; Run All Models in parallel

## Tech Stack

- React 18 · Create React App
- Claude Sonnet API (`claude-sonnet-4-6`) · 8,192 token context
- Mobile-first PWA-ready · Vercel deployment
