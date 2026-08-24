import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import { saveSnippetToSupabase } from "@/lib/supabase";

type SourceType = "snippet" | "prompt";

type GenerateRequest = {
  title?: string;
  content: string;
  sourceType?: SourceType;
};

type GeneratedSnippet = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sourceType: SourceType;
  createdAt: string;
  storage: "supabase" | "demo";
};

const tagMap: Array<[RegExp, string]> = [
  [/python|pip|django|flask|pandas|numpy/i, "Python"],
  [/typescript|javascript|react|next\.js|node|vite/i, "JavaScript"],
  [/sql|postgres|supabase|database|schema/i, "PostgreSQL"],
  [/algorith|binary|search|graph|tree|sort/i, "Algorithms"],
  [/aws|docker|kubernetes|devops|ci\/cd/i, "DevOps"],
  [/api|rest|graphql|webhook|server/i, "APIs"],
  [/ai|llm|prompt|rag|vector|ml/i, "AI"],
  [/css|tailwind|design|ui|ux|frontend/i, "Frontend"],
  [/rust|go|java|c\+\+|swift|golang/i, "Systems"],
];

function normalizeTags(content: string): string[] {
  const matches = new Set<string>();

  tagMap.forEach(([pattern, label]) => {
    if (pattern.test(content)) {
      matches.add(label);
    }
  });

  if (matches.size === 0) {
    matches.add("General Development");
    matches.add("Productivity");
    matches.add("Software Engineering");
  }

  return Array.from(matches).slice(0, 3);
}

function parseGroqTags(content: string): string[] {
  const fallback = normalizeTags(content);

  try {
    const raw = content
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(raw);
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags
          .map((tag: string) => String(tag).trim())
          .filter(Boolean)
          .slice(0, 3)
      : fallback;

    return tags.length ? tags : fallback;
  } catch {
    return fallback;
  }
}

async function generateTagsWithGroq(content: string) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return normalizeTags(content);
  }

  const client = new Groq({ apiKey });

  const prompt = `Analyze this code or prompt and return exactly 3 highly relevant technology tags in JSON format as {"tags":["tag1","tag2","tag3"]}. Keep tags short and technical. Source text:\n${content}`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are an expert code and prompt tagger. Return only valid JSON with a tags array of exactly 3 entries.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.35,
    max_tokens: 160,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "";

  if (!raw) {
    return normalizeTags(content);
  }

  try {
    const json = JSON.parse(raw) as { tags?: string[] };
    const tags = Array.isArray(json.tags)
      ? json.tags
          .map((tag: string) => String(tag).trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

    return tags.length ? tags : normalizeTags(content);
  } catch {
    return parseGroqTags(raw);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const content = String(body.content ?? "").trim();
    const title = String(body.title ?? "Untitled snippet").trim();
    const sourceType = body.sourceType === "prompt" ? "prompt" : "snippet";

    if (!content) {
      return NextResponse.json(
        { error: "Please provide a snippet or prompt to analyze." },
        { status: 400 },
      );
    }

    const tags = await generateTagsWithGroq(content);
    const payload: GeneratedSnippet = {
      id: crypto.randomUUID(),
      title: title || "Untitled snippet",
      content,
      tags,
      sourceType,
      createdAt: new Date().toISOString(),
      storage: "demo",
    };

    const supabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (supabaseConfigured) {
      try {
        await saveSnippetToSupabase({
          title: payload.title,
          content: payload.content,
          tags: payload.tags,
          sourceType: payload.sourceType,
        });
        payload.storage = "supabase";
      } catch (error) {
        console.warn("Supabase save failed, falling back to demo mode.", error);
      }
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Snippet generation failed:", error);
    return NextResponse.json(
      { error: "Unable to generate snippet tags right now." },
      { status: 500 },
    );
  }
}
