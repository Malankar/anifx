import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "@/App"
import "@/index.css"

// Surface any runtime error with exactly where it happened, same as
// shared.js's window.onerror/unhandledrejection handlers did.
window.addEventListener("error", (e) => {
  const file = (e.filename || "?").split("/").pop()
  console.error("[AniFX] " + e.message + " — " + file + ":" + e.lineno + ":" + e.colno + (e.error?.stack ? "\n" + e.error.stack : ""))
})
window.addEventListener("unhandledrejection", (e) => {
  console.error("[AniFX] Unhandled promise rejection:", e.reason)
})

// StrictMode is intentionally left off — its dev-only double-invoked
// effects would double-run this port's imperative, DOM-mutating effects
// (intro letter-splitting, the first-visit localStorage check, the
// FC26 ball kick) in ways the original vanilla-JS site never did,
// producing visible glitches that aren't part of the real site.
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
