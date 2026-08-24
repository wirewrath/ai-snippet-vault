"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Code2,
  Database,
  Layers3,
  Plus,
  Sparkles,
  Tag,
} from "lucide-react";

type SourceType = "snippet" | "prompt";

type SnippetCard = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sourceType: SourceType;
  createdAt: string;
  storage: "supabase" | "demo";
};

const starterSnippets: SnippetCard[] = [
  {
    id: "starter-1",
    title: "Binary search helper",
    content: `def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return -1`,
    tags: ["Algorithms", "Python", "Efficiency"],
    sourceType: "snippet",
    createdAt: new Date().toISOString(),
    storage: "demo",
  },
  {
    id: "starter-2",
    title: "Prompt idea: AI onboarding flow",
    content:
      "Design a frictionless onboarding flow for a SaaS product that helps users connect their project, invite team members, and activate AI summaries in under five minutes.",
    tags: ["AI", "Product Design", "Prompting"],
    sourceType: "prompt",
    createdAt: new Date().toISOString(),
    storage: "demo",
  },
];

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(
    "function findLongestSubstring(str) {\n  const seen = new Map();\n  let left = 0;\n  let max = 0;\n\n  for (let right = 0; right < str.length; right++) {\n    const char = str[right];\n    if (seen.has(char)) left = Math.max(left, seen.get(char) + 1);\n    seen.set(char, right);\n    max = Math.max(max, right - left + 1);\n  }\n\n  return max;\n}",
  );
  const [sourceType, setSourceType] = useState<SourceType>("snippet");
  const [snippets, setSnippets] = useState<SnippetCard[]>(() => {
    if (typeof window === "undefined") {
      return starterSnippets;
    }

    try {
      const saved = window.localStorage.getItem("ai-snippet-vault");
      if (!saved) {
        return starterSnippets;
      }

      const parsed = JSON.parse(saved) as SnippetCard[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : starterSnippets;
    } catch {
      return starterSnippets;
    }
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ai-snippet-vault", JSON.stringify(snippets));
    }
  }, [snippets]);

  const stats = useMemo(() => {
    const flattened = snippets.flatMap((snippet) => snippet.tags);
    const uniqueTags = new Set(flattened).size;

    return {
      total: snippets.length,
      tags: uniqueTags,
      stored: snippets.filter((snippet) => snippet.storage === "supabase").length,
    };
  }, [snippets]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Add a snippet or prompt before submitting.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Untitled snippet",
          content,
          sourceType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate tags.");
      }

      setSnippets((current) => [data, ...current]);
      setTitle("");
      setContent("");
      setSourceType("snippet");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating tags.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-2 text-violet-300">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-violet-300">
                AI Workspace
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                AI Snippet Vault
              </h1>
            </div>
          </div>

          <button
            type="button"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            onClick={() => {
              setTitle("");
              setContent("");
              setSourceType("snippet");
            }}
          >
            Clear form
          </button>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/60">
            <div className="mb-3 flex items-center justify-between text-slate-300">
              <span className="text-sm">Saved snippets</span>
              <Layers3 className="h-4 w-4 text-violet-300" />
            </div>
            <div className="text-3xl font-semibold">{stats.total}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/60">
            <div className="mb-3 flex items-center justify-between text-slate-300">
              <span className="text-sm">AI tags</span>
              <Tag className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="text-3xl font-semibold">{stats.tags}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/60">
            <div className="mb-3 flex items-center justify-between text-slate-300">
              <span className="text-sm">Supabase sync</span>
              <Database className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="text-3xl font-semibold">{stats.stored}</div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/60"
          >
            <div className="mb-5 flex items-center gap-2 text-violet-300">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-medium">Analyze new input</h2>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Title</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Prompt engineering checklist"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm text-slate-300">Source type</span>
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-700 bg-slate-950 p-1">
                  {(["snippet", "prompt"] as SourceType[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSourceType(option)}
                      className={`rounded-xl px-3 py-2 text-sm capitalize transition ${
                        sourceType === option
                          ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Snippet or prompt</span>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={14}
                  placeholder="Paste code, a prompt, or a design note..."
                  className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {isSubmitting ? "Generating tags..." : "Generate tags"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/60">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-cyan-300">
                <Code2 className="h-5 w-5" />
                <h2 className="text-lg font-medium text-white">Recent vault entries</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
                {snippets.length} items
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {snippets.map((snippet) => (
                <article
                  key={snippet.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {snippet.sourceType}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        {snippet.title}
                      </h3>
                    </div>
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {snippet.storage}
                    </span>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {snippet.tags.map((tag) => (
                      <span
                        key={`${snippet.id}-${tag}`}
                        className="rounded-full bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-200 ring-1 ring-violet-500/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-3 text-xs leading-6 text-slate-300">
                    {snippet.content}
                  </pre>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
