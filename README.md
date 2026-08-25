# ⚡ AI Snippet Vault

An AI-native full-stack application that organizes code snippets using LLM classification.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Create a `.env.local` file from `.env.example` and set `GROQ_API_KEY`. The
default model is `openai/gpt-oss-20b`; set `GROQ_MODEL` if your Groq
account uses a different currently available model. After changing these
variables in Vercel, redeploy the application.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL), Next.js API Routes
- **AI Integration:** Groq API (`llama-3.3-70b-versatile`)
- **Deployment:** Vercel

## ✨ Key Features

- **Instant AI Tagging:** Sends code snippets to Groq API to automatically extract relevant tech tags (`#Python`, `#Database`, etc.).
- **Persisted Storage:** Real-time database insertion and retrieval via Supabase.
- **Sleek UI:** Dark-mode dashboard built for fast developer workflow.
