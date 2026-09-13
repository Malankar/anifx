import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export type Registration = {
  id: string;
  uid: string;
  trackId: string;
  trackName: string;
  teamName?: string;
  registrantName: string;
  registrantPhone: string;
  registrantEmail: string;
  age?: number;
  classYear?: string;
  board?: string;
  college: string;
  address: string;
  roster?: string;
  feeTierKey?: string;
  fee: number;
  status: "pending_payment" | "awaiting_verification" | "verified" | "waitlist" | "free_confirmed";
  paymentRef?: string;
  createdAt: unknown;
};

export type NewRegistrationInput = Omit<
  Registration,
  "id" | "uid" | "status" | "createdAt"
>;

const COLLECTION = "registrations";

export async function createRegistration(uid: string, input: NewRegistrationInput) {
  const status: Registration["status"] = input.fee > 0 ? "pending_payment" : "free_confirmed";
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    uid,
    status,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function watchMyRegistrations(
  uid: string,
  cb: (regs: Registration[]) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION), where("uid", "==", uid));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Registration, "id">) })));
  });
}

export function watchAllRegistrations(cb: (regs: Registration[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COLLECTION), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Registration, "id">) })));
  });
}

// Admin-only writes — Firestore security rules also require the `admin`
// custom claim, this is just the client-side call.
export async function setPaymentRef(id: string, paymentRef: string) {
  await updateDoc(doc(db, COLLECTION, id), { paymentRef, status: "awaiting_verification" });
}

export async function verifyRegistration(id: string) {
  await updateDoc(doc(db, COLLECTION, id), { status: "verified" });
}

export async function waitlistRegistration(id: string) {
  await updateDoc(doc(db, COLLECTION, id), { status: "waitlist" });
}
