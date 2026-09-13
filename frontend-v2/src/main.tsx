import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/lib/auth-context"
import { firebaseInitError } from "@/lib/firebase"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { SetupError } from "@/components/SetupError"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {firebaseInitError ? (
      <SetupError error={firebaseInitError} />
    ) : (
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark">
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </ErrorBoundary>
    )}
  </StrictMode>
)
