# ⚡ AI Snippet Vault

[AI Snippet Vault](https://ai-snippet-vault.vercel.app/) is a developer workspace built with Next.js, Supabase, and Groq AI. It allows developers to store, automatically organize, and retrieve reusable code snippets, AI system prompts, and technical notes.

---

## ✨ Features

* **🤖 AI Auto-Tagging:** Automatically analyzes code snippets or prompt templates using Groq LLMs (`llama-3.3-70b-versatile`) to extract relevant tags (e.g., `#Python`, `#Algorithms`, `#Product Design`).
* **☁️ Supabase Synchronization:** Syncs saved items to a Supabase Postgres database backend for cloud persistent storage across devices.
* **🏷️ Dual Source Types:** Organizes entries into dedicated **Snippet** and **Prompt** categories.
* **⚡ Modern Next.js Stack:** Built with Next.js App Router for fast performance and instant UI updates.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (React / TypeScript)
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **AI Provider:** [Groq Cloud](https://groq.com/) (Llama 3.3 70B Versatile)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
* Node.js (v18 or higher)
* npm, yarn, or pnpm
* A [Supabase](https://supabase.com/) project
* A [Groq API Key](https://console.groq.com/)

### Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=gsk_your_groq_api_key
