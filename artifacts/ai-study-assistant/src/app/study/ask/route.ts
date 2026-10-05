import { GoogleGenAI } from "@google/genai";
import { NextResponse, type NextRequest } from "next/server";
import type { QuestionEntry } from "@/lib/types";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const STUDY_ASSISTANT_INSTRUCTION =
  "You are a helpful AI Study Assistant. Explain concepts clearly and accurately in simple language. Use short structured explanations when useful. Focus on helping the student understand rather than just giving an answer.";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const { config: supabaseConfig, missing } = getSupabasePublicConfig();
  if (!supabaseConfig) {
    return jsonError(
      `Supabase is not configured. Add ${missing.join(" and ")} in Replit Secrets.`,
      503,
    );
  }

  let supabase: Awaited<ReturnType<typeof createClient>> | null = null;
  try {
    supabase = await createClient();
  } catch {
    return jsonError("Please log in again to ask a study question.", 401);
  }
  if (!supabase) {
    return jsonError("Please log in again to ask a study question.", 401);
  }

  let userId: string | null = null;
  try {
    const { data, error } = await supabase.auth.getClaims();
    const subject = data?.claims?.sub;
    if (!error && typeof subject === "string" && subject.length > 0) {
      userId = subject;
    }
  } catch {
    userId = null;
  }

  if (!userId) {
    return jsonError("Please log in again to ask a study question.", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Enter a study question before submitting.", 400);
  }

  const question =
    typeof body === "object" && body !== null && "question" in body
      ? body.question
      : undefined;
  if (typeof question !== "string" || question.trim().length === 0) {
    return jsonError("Enter a study question before submitting.", 400);
  }
  if (question.length > 5000) {
    return jsonError("Keep your question under 5,000 characters.", 400);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return jsonError("Gemini is not configured. Add GEMINI_API_KEY in Replit Secrets.", 503);
  }

  let answer: string;
  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: question.trim(),
      config: {
        systemInstruction: STUDY_ASSISTANT_INSTRUCTION,
        maxOutputTokens: 1200,
      },
    });
    answer = response.text?.trim() ?? "";
    if (!answer) {
      return jsonError("Gemini did not return an answer. Please try again.", 502);
    }
  } catch {
    return jsonError("Gemini could not answer right now. Please try again.", 502);
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .insert({
        user_id: userId,
        question: question.trim(),
        answer,
      })
      .select("id, question, answer, created_at")
      .single<QuestionEntry>();

    if (error || !data) {
      return jsonError(
        "Your answer could not be saved. Check that the Supabase setup SQL has been run, then try again.",
        500,
      );
    }

    return NextResponse.json({ entry: data }, { status: 201 });
  } catch {
    return jsonError(
      "Your answer could not be saved. Check that the Supabase setup SQL has been run, then try again.",
      500,
    );
  }
}
