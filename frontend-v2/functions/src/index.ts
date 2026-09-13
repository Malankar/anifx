import { initializeApp } from "firebase-admin/app";
import { getFirestore, Transaction } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

initializeApp();
const db = getFirestore();

// Hard caps, mirrored from the old Apps Script backend. 0 = no cap.
// This is the number that actually counts — client UI is a convenience only.
const CAPS: Record<string, number> = {
  valorant: 32,
  fc26: 64,
  gamejam: 0,
  film: 0,
  character: 0,
};

/**
 * Runs right after a registration is created:
 * - assigns a short human entryId (and WL- prefix if the track is full)
 * - checks the cap against currently-verified entries for that track
 * - queues a confirmation email via the Trigger Email extension
 *   (writes to the `mail` collection, which the extension watches)
 */
export const onRegistrationCreated = onDocumentCreated(
  "registrations/{regId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const reg = snap.data();
    const trackId: string = reg.trackId;
    const cap = CAPS[trackId] || 0;

    const isWaitlist = await db.runTransaction(async (tx: Transaction) => {
      if (cap <= 0) return false;
      const verifiedSnap = await tx.get(
        db.collection("registrations").where("trackId", "==", trackId).where("status", "==", "verified")
      );
      return verifiedSnap.size >= cap;
    });

    const counterRef = db.collection("counters").doc(trackId);
    const seq = await db.runTransaction(async (tx: Transaction) => {
      const doc = await tx.get(counterRef);
      const next = (doc.exists ? doc.data()!.count : 0) + 1;
      tx.set(counterRef, { count: next }, { merge: true });
      return next;
    });

    const prefix = trackId.slice(0, 3).toUpperCase();
    const entryId = `${isWaitlist ? "WL-" : ""}${prefix}-${String(seq).padStart(3, "0")}`;

    const update: Record<string, unknown> = { entryId };
    if (isWaitlist) update.status = "waitlist";
    await snap.ref.update(update);

    if (reg.registrantEmail) {
      await db.collection("mail").add({
        to: reg.registrantEmail,
        message: {
          subject: `Entry received — ${reg.trackName} — AniFX 2026`,
          html: buildConfirmationHtml(reg, entryId, isWaitlist),
        },
      });
    }
  }
);

function buildConfirmationHtml(
  reg: Record<string, unknown>,
  entryId: string,
  isWaitlist: boolean
): string {
  const name = String(reg.registrantName || "there");
  const track = String(reg.trackName || "");
  const fee = Number(reg.fee || 0);
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#16121A">
      <div style="background:#16121A;color:#F2EDE4;padding:22px">
        <div style="font-size:26px;font-weight:bold">ANIFX <span style="color:#FFB020">26</span></div>
      </div>
      <div style="padding:24px 22px">
        <p>Hi ${escapeHtml(name)},</p>
        ${
          isWaitlist
            ? `<p><b>All slots for ${escapeHtml(track)} are taken.</b> You are on the waitlist — do not pay until we confirm a slot.</p>`
            : `<p>We have your entry for <b>${escapeHtml(track)}</b>. ${
                fee > 0
                  ? "Your slot is not confirmed until payment is verified — usually under 48 hours."
                  : "This entry is free — no payment needed."
              }</p>`
        }
        <p>Entry ID: <b>${escapeHtml(entryId)}</b></p>
      </div>
    </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Grants (or revokes) the `admin` custom claim on a user.
 * - The very first admin can be bootstrapped by anyone signed in, IF no
 *   admin exists yet (checked via the singleton meta/admins doc).
 * - After that, only an existing admin may call this.
 */
export const setAdmin = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");

  const { targetUid, admin } = request.data as { targetUid: string; admin: boolean };
  if (!targetUid) throw new HttpsError("invalid-argument", "targetUid required.");

  const metaRef = db.collection("meta").doc("admins");
  const metaSnap = await metaRef.get();
  const hasAnyAdmin = metaSnap.exists && metaSnap.data()!.bootstrapped;

  const isCallerAdmin = request.auth.token.admin === true;
  if (hasAnyAdmin && !isCallerAdmin) {
    throw new HttpsError("permission-denied", "Only an existing admin can do this.");
  }
  if (!hasAnyAdmin && targetUid !== request.auth.uid) {
    throw new HttpsError(
      "failed-precondition",
      "First admin bootstrap must target your own uid."
    );
  }

  await getAuth().setCustomUserClaims(targetUid, { admin });
  if (!hasAnyAdmin) await metaRef.set({ bootstrapped: true });

  return { ok: true };
});
