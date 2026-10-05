export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="auth-main" style={{ textAlign: "center" }}>
        <div className="eyebrow">404 · Page not found</div>
        <h1 className="auth-title" style={{ marginTop: 20 }}>This page doesn&apos;t exist.</h1>
        <p className="auth-subtitle" style={{ marginBottom: 24 }}>
          Return to your study space and continue from there.
        </p>
        <a className="button" href="/">Return home</a>
      </section>
    </main>
  );
}
