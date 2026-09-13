import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// All values come from Vite env vars (.env.local, not committed).
// See .env.example for the keys to fill in from the Firebase console.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase throws synchronously if the config is missing/malformed — that
// happens at module-import time, before React even mounts, so a React
// error boundary can't catch it (blank white screen, error only in the
// console). Catch it here instead and surface a real error page from
// main.tsx, which checks `firebaseInitError` before rendering.
export let firebaseInitError: Error | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _app: any, _auth: any, _db: any, _functions: any;
try {
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Missing Firebase config. Copy .env.example to .env.local and fill in your Firebase project's values."
    );
  }
  _app = initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  _db = getFirestore(_app);
  _functions = getFunctions(_app);
} catch (err) {
  firebaseInitError = err instanceof Error ? err : new Error(String(err));
}

export const app = _app;
export const auth = _auth;
export const db = _db;
export const functions = _functions;
