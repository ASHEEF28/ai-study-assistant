"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthView } from "@/components/study-ui";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

type AuthPageClientProps = {
  mode: "login" | "signup";
};

function getConfigurationError() {
  const { config, missing } = getSupabasePublicConfig();
  return config
    ? null
    : `Supabase is not configured. Add ${missing.join(" and ")} in Replit Secrets.`;
}

function getFriendlyAuthError(error: unknown, mode: AuthPageClientProps["mode"]) {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String(error.message).toLowerCase()
      : "";

  if (message.includes("email not confirmed")) {
    return "Confirm your email address before signing in.";
  }
  if (mode === "login" && message.includes("invalid login credentials")) {
    return "Your email or password is incorrect. Please try again.";
  }
  return mode === "login"
    ? "We couldn't sign you in. Please check your details and try again."
    : "We couldn't create your account. Please check your details and try again.";
}

export function AuthPageClient({ mode }: AuthPageClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(getConfigurationError);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const configurationError = getConfigurationError();
    if (configurationError) {
      setError(configurationError);
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(getFriendlyAuthError(signInError, mode));
          return;
        }
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (signUpError) {
        setError(getFriendlyAuthError(signUpError, mode));
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setPassword("");
      setNotice("Account created. Check your email for a confirmation link, then sign in.");
    } catch {
      setError(getFriendlyAuthError(null, mode));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthView
      mode={mode}
      email={email}
      password={password}
      busy={busy}
      error={error}
      notice={notice}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
