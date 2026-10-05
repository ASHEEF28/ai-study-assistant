"use client";

import type { FormEvent } from "react";
import type { QuestionEntry } from "@/lib/types";

export type AuthUiProps = {
  mode: "login" | "signup";
  email: string;
  password: string;
  busy: boolean;
  error: string | null;
  notice: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type DashboardUiProps = {
  userEmail: string;
  questions: QuestionEntry[];
  historyError: string | null;
  question: string;
  busy: boolean;
  error: string | null;
  onQuestionChange: (question: string) => void;
  onAsk: (event: FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
};

function Brand() {
  return (
    <a className="brand" href="/" aria-label="AI Study Assistant home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.5 6.5c2.8-.8 5.3-.3 7.5 1.4v10c-2.2-1.7-4.7-2.2-7.5-1.4v-10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M19.5 6.5c-2.8-.8-5.3-.3-7.5 1.4v10c2.2-1.7 4.7-2.2 7.5-1.4v-10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      </span>
      <span>Study companion</span>
    </a>
  );
}

function HeaderActions({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <nav className="header-actions" aria-label="Main navigation">
      {signedIn ? (
        <a className="button button-small" href="/dashboard">Open dashboard</a>
      ) : (
        <>
          <a className="text-link" href="/login">Login</a>
          <a className="button button-small" href="/signup">Sign Up</a>
        </>
      )}
    </nav>
  );
}

function FeatureIcon({ kind }: { kind: "clarity" | "history" | "focus" }) {
  if (kind === "clarity") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3.5v2M12 18.5v2M3.5 12h2m13 0h2M6 6l1.4 1.4m9.2 9.2L18 18m0-12-1.4 1.4m-9.2 9.2L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (kind === "history") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 5.5h14v15H5zM8 3.5v4M16 3.5v4M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 18.5 6.2 14A7.5 7.5 0 1 1 9 18l-4 0.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 11.5h6M9 14.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LandingView({
  signedIn = false,
  email,
}: {
  signedIn?: boolean;
  email?: string | null;
}) {
  return (
    <div className="page-shell">
      <header className="site-header">
        <Brand />
        <HeaderActions signedIn={signedIn} />
      </header>
      <main className="landing-main">
        <div className="eyebrow"><span className="eyebrow-dot" />A quieter way to study</div>
        <h1 className="landing-title">Understand more.<br /><span>Remember what matters.</span></h1>
        <p className="landing-description">
          Ask a question, get a clear explanation, and keep a dependable record of what you have learned.
          Study at your own pace, one idea at a time.
        </p>
        <div className="landing-actions">
          <a className="button" href={signedIn ? "/dashboard" : "/signup"}>
            {signedIn ? "Continue studying" : "Sign Up"}
            <span aria-hidden="true">→</span>
          </a>
          {!signedIn && <a className="button button-secondary" href="/login">Login</a>}
        </div>
        {signedIn && email ? <p className="landing-note">Signed in as {email}</p> : null}

        <section className="feature-panel" aria-labelledby="features-title">
          <h2 className="feature-panel-heading" id="features-title">Made for focused learning</h2>
          <div className="feature-row">
            <article className="feature-item">
              <span className="feature-icon"><FeatureIcon kind="clarity" /></span>
              <div>
                <h2>Clear explanations</h2>
                <p>Get a concise answer that makes difficult ideas easier to approach.</p>
              </div>
            </article>
            <article className="feature-item">
              <span className="feature-icon"><FeatureIcon kind="history" /></span>
              <div>
                <h2>Your study history</h2>
                <p>Return to your questions and answers whenever you need a refresher.</p>
              </div>
            </article>
            <article className="feature-item">
              <span className="feature-icon"><FeatureIcon kind="focus" /></span>
              <div>
                <h2>Room to think</h2>
                <p>A simple space to follow your curiosity without extra distractions.</p>
              </div>
            </article>
          </div>
        </section>
        <footer className="landing-footer">A little more clarity, every time you study.</footer>
      </main>
    </div>
  );
}

export function AuthView({
  mode,
  email,
  password,
  busy,
  error,
  notice,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AuthUiProps) {
  const isLogin = mode === "login";
  return (
    <div className="page-shell">
      <header className="site-header">
        <Brand />
        <a className="text-link" href="/">Back to home</a>
      </header>
      <main className="auth-main">
        <div className="auth-intro">
          <div className="eyebrow"><span className="eyebrow-dot" />Your study space</div>
          <h1 className="auth-title">{isLogin ? "Welcome back" : "Start studying clearly"}</h1>
          <p className="auth-subtitle">
            {isLogin ? "Sign in to pick up where you left off." : "Create an account to save your study history."}
          </p>
        </div>
        <form className="auth-card" onSubmit={onSubmit} aria-busy={busy}>
          {error ? <div className="alert alert-error" role="alert">{error}</div> : null}
          {notice ? <div className="alert alert-success" role="status">{notice}</div> : null}
          <div className="field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => onEmailChange(event.currentTarget.value)}
              required
              disabled={busy}
            />
          </div>
          <div className="field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => onPasswordChange(event.currentTarget.value)}
              required
              disabled={busy}
            />
          </div>
          <button className="button auth-submit" type="submit" disabled={busy}>
            {busy ? (isLogin ? "Signing in…" : "Creating account…") : (isLogin ? "Login" : "Sign Up")}
          </button>
          <p className="auth-switch">
            {isLogin ? "New to the study companion? " : "Already have an account? "}
            <a href={isLogin ? "/signup" : "/login"}>{isLogin ? "Sign Up" : "Login"}</a>
          </p>
        </form>
      </main>
    </div>
  );
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function QuestionAnswer({ entry, prominent = false }: { entry: QuestionEntry; prominent?: boolean }) {
  return (
    <article className={prominent ? "answer-card" : "history-item"}>
      {prominent ? <p className="answer-label">Latest answer</p> : null}
      <h3 className="entry-question">{entry.question}</h3>
      <p className="entry-answer">{entry.answer}</p>
      <time className="entry-time" dateTime={entry.created_at}>{formatTimestamp(entry.created_at)}</time>
    </article>
  );
}

export function DashboardView({
  userEmail,
  questions,
  historyError,
  question,
  busy,
  error,
  onQuestionChange,
  onAsk,
  onLogout,
}: DashboardUiProps) {
  const newest = questions[0];
  const previous = questions.slice(1);
  return (
    <div className="page-shell">
      <header className="site-header">
        <Brand />
        <button className="button button-secondary button-small" type="button" onClick={onLogout}>Sign out</button>
      </header>
      <main className="dashboard-main">
        <section className="dashboard-topline" aria-labelledby="dashboard-title">
          <div>
            <p className="dashboard-kicker">Your learning space</p>
            <h1 className="dashboard-title" id="dashboard-title">What are you curious about?</h1>
            <p className="user-email">{userEmail}</p>
          </div>
        </section>

        <form className="ask-card" onSubmit={onAsk} aria-busy={busy}>
          <h2 className="ask-heading">Ask a study question</h2>
          <label className="sr-only" htmlFor="study-question">Your question</label>
          <textarea
            className="question-input"
            id="study-question"
            name="question"
            placeholder="Ask anything you are studying..."
            value={question}
            onChange={(event) => onQuestionChange(event.currentTarget.value)}
            required
            disabled={busy}
          />
          <div className="ask-controls">
            <span className="ask-hint">Clear, focused answers saved to your history.</span>
            <button className="button" type="submit" disabled={busy || !question.trim()}>
              {busy ? "Thinking..." : "Ask Gemini"}
            </button>
          </div>
          {error ? <div className="alert alert-error" role="alert" style={{ margin: "15px 0 0" }}>{error}</div> : null}
        </form>

        <section className="history-section" aria-labelledby="history-title">
          <div className="history-heading">
            <h2 id="history-title">Previous Questions</h2>
            {questions.length > 0 ? <span className="history-count">{questions.length} {questions.length === 1 ? "entry" : "entries"}</span> : null}
          </div>
          {historyError ? <div className="alert alert-error" role="alert">{historyError}</div> : null}
          {questions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 5.5h14v15H5zM8 3.5v4M16 3.5v4M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3>Your study history starts here</h3>
              <p>Ask your first question above. Your saved answer will appear here.</p>
            </div>
          ) : (
            <div className="history-list">
              {newest ? <QuestionAnswer entry={newest} prominent /> : null}
              {previous.map((entry) => <QuestionAnswer key={entry.id} entry={entry} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
