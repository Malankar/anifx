/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

// Prefixed so it's easy to grep in devtools while debugging sign-in issues.
const LOG = "[AniFX Auth]";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log(LOG, "provider mounted, auth domain:", auth.config.authDomain);

    const unsubUser = onAuthStateChanged(
      auth,
      (u) => {
        console.log(LOG, "onAuthStateChanged:", u ? { uid: u.uid, email: u.email } : null);
        setUser(u);
        setLoading(false);
      },
      (err) => console.error(LOG, "onAuthStateChanged error:", err)
    );
    // Admin status is a custom claim (set via the setAdmin Cloud Function) —
    // onIdTokenChanged catches it after a fresh token, without a full reload.
    const unsubToken = onIdTokenChanged(auth, async (u) => {
      if (!u) return setIsAdmin(false);
      const token = await u.getIdTokenResult();
      console.log(LOG, "token claims:", token.claims);
      setIsAdmin(!!token.claims.admin);
    });

    // Catches the result when signInWithGoogle had to fall back to a
    // full-page redirect (see below) — the redirect comes back here.
    getRedirectResult(auth)
      .then((result) => {
        if (result) console.log(LOG, "getRedirectResult: signed in via redirect", result.user.uid);
      })
      .catch((err) => console.error(LOG, "getRedirectResult error:", err.code, err.message));

    return () => {
      unsubUser();
      unsubToken();
    };
  }, []);

  async function signUpWithEmail(name: string, email: string, password: string) {
    console.log(LOG, "signUpWithEmail:", email);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      console.log(LOG, "signUpWithEmail success:", cred.user.uid);
    } catch (err) {
      logAuthError("signUpWithEmail", err);
      throw err;
    }
  }

  async function signInWithEmail(email: string, password: string) {
    console.log(LOG, "signInWithEmail:", email);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log(LOG, "signInWithEmail success:", cred.user.uid);
    } catch (err) {
      logAuthError("signInWithEmail", err);
      throw err;
    }
  }

  async function signInWithGoogle() {
    console.log(LOG, "signInWithGoogle: opening popup");
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log(LOG, "signInWithGoogle success:", cred.user.uid);
    } catch (err) {
      logAuthError("signInWithGoogle (popup)", err);
      const code = (err as { code?: string }).code;
      // Popup blocked or blocked-by-browser-extension is the most common
      // real-world failure — fall back to a full-page redirect instead of
      // just erroring out.
      if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
        console.warn(LOG, "signInWithGoogle: popup blocked, falling back to redirect");
        await signInWithRedirect(auth, new GoogleAuthProvider());
        return;
      }
      throw err;
    }
  }

  async function signOut() {
    console.log(LOG, "signOut");
    await fbSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, signUpWithEmail, signInWithEmail, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function logAuthError(where: string, err: unknown) {
  const e = err as { code?: string; message?: string };
  console.error(`${LOG} ${where} failed:`, e.code, e.message, err);

  const hints: Record<string, string> = {
    "auth/unauthorized-domain":
      "This domain isn't in Firebase console → Authentication → Settings → Authorized domains. Add localhost (and your deployed domain).",
    "auth/operation-not-allowed":
      "Google sign-in isn't enabled. Firebase console → Authentication → Sign-in method → enable Google.",
    "auth/popup-closed-by-user": "User closed the Google popup before finishing.",
    "auth/network-request-failed": "Network error reaching Firebase — check connectivity/ad blockers.",
    "auth/invalid-api-key": "VITE_FIREBASE_API_KEY in .env.local is wrong or missing.",
  };
  if (e.code && hints[e.code]) console.warn(`${LOG} hint:`, hints[e.code]);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
