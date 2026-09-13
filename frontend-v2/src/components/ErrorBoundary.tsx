import { Component, type ReactNode } from "react";
import { SetupError } from "./SetupError";

// Catches render-time crashes after the app has mounted and shows a
// readable message instead of a blank white screen. (Firebase's own
// module-load-time crash is caught separately — see lib/firebase.ts and
// main.tsx's firebaseInitError check, since that happens before React
// mounts and this boundary can't see it.)
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) return <SetupError error={this.state.error} />;
    return this.props.children;
  }
}
