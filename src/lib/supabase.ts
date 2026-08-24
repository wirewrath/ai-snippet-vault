import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function saveSnippetToSupabase(payload: {
  title: string;
  content: string;
  tags: string[];
  sourceType: "snippet" | "prompt";
}) {
  if (!supabase || !supabaseServiceRoleKey) {
    return { saved: false, reason: "Supabase is not configured." };
  }

  const { error } = await supabase.from("snippet_vault").insert({
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
    source_type: payload.sourceType,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { saved: true };
}
