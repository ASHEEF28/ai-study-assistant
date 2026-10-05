"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DashboardView } from "@/components/study-ui";
import { createClient } from "@/lib/supabase/client";
import type { QuestionEntry } from "@/lib/types";

type DashboardClientProps = {
  userEmail: string;
  initialQuestions: QuestionEntry[];
  initialHistoryError: string | null;
};

function isQuestionEntry(value: unknown): value is QuestionEntry {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || !("question" in value) || !("answer" in value) || !("created_at" in value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.question === "string" &&
    typeof value.answer === "string" &&
    typeof value.created_at === "string"
  );
}

function getApiMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("error" in value)) return null;
  return typeof value.error === "string" ? value.error : null;
}

export function DashboardClient({
  userEmail,
  initialQuestions,
  initialHistoryError,
}: DashboardClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [historyError, setHistoryError] = useState(initialHistoryError);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || busy) return;

    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/study/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getApiMessage(result) ?? "We couldn't get an answer. Please try again.",
        );
      }

      const entry =
        typeof result === "object" && result !== null && "entry" in result
          ? result.entry
          : null;
      if (!isQuestionEntry(entry)) {
        throw new Error("We couldn't read the saved answer. Please refresh and try again.");
      }

      setQuestions((current) => [
        entry,
        ...current.filter((item) => item.id !== entry.id),
      ]);
      setHistoryError(null);
      setQuestion("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn't get an answer. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setError(null);
    try {
      const supabase = createClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("We couldn't sign you out. Please try again.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("We couldn't sign you out. Please try again.");
    }
  }

  return (
    <DashboardView
      userEmail={userEmail}
      questions={questions}
      historyError={historyError}
      question={question}
      busy={busy}
      error={error}
      onQuestionChange={setQuestion}
      onAsk={handleAsk}
      onLogout={handleLogout}
    />
  );
}
