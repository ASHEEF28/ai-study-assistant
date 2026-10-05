import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { QuestionEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

const HISTORY_LOAD_ERROR =
  "Saved questions could not be loaded. Check that supabase/setup.sql has been run in the Supabase SQL Editor, then refresh.";

export default async function DashboardPage() {
  const { config } = getSupabasePublicConfig();
  if (!config) redirect("/login");

  let supabase: Awaited<ReturnType<typeof createClient>> | null = null;
  try {
    supabase = await createClient();
  } catch {
    redirect("/login");
  }
  if (!supabase) redirect("/login");

  let claims: Record<string, unknown> | null = null;
  try {
    const result = await supabase.auth.getClaims();
    if (!result.error && result.data?.claims) {
      claims = result.data.claims as Record<string, unknown>;
    }
  } catch {
    claims = null;
  }

  if (!claims || typeof claims.sub !== "string" || claims.sub.length === 0) {
    redirect("/login");
  }
  const userId = claims.sub;
  const userEmail = typeof claims.email === "string" ? claims.email : "Signed-in student";

  let questions: QuestionEntry[] = [];
  let historyError: string | null = null;
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("id, question, answer, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      historyError = HISTORY_LOAD_ERROR;
    } else {
      questions = (data ?? []) as QuestionEntry[];
    }
  } catch {
    historyError = HISTORY_LOAD_ERROR;
  }

  return (
    <DashboardClient
      userEmail={userEmail}
      initialQuestions={questions}
      initialHistoryError={historyError}
    />
  );
}
