// Shown instead of a blank white screen when Firebase config is missing or
// the app crashed on init — see lib/firebase.ts (firebaseInitError) and
// ErrorBoundary.tsx.
export function SetupError({ error }: { error: Error }) {
  const missingEnv = error.message.includes("Missing Firebase config");

  return (
    <div style={{ maxWidth: 640, margin: "80px auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>App failed to start</h1>
      {missingEnv ? (
        <>
          <p style={{ marginBottom: 12 }}>
            No Firebase config found. Copy <code>.env.example</code> to <code>.env.local</code>{" "}
            and fill in your Firebase project's web app values, then restart <code>pnpm dev</code>.
          </p>
          <p style={{ color: "#888", fontSize: 13 }}>See README.md → "One-time setup".</p>
        </>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, color: "#c00" }}>{error.message}</pre>
      )}
    </div>
  );
}
