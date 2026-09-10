import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

const COLLECTION = "user-counts";
const COUNTER_ID = "total";
const STORAGE_KEY = "tsr_unique_visitor_id";

let trackPromise = null;

function counterRef() {
  return doc(db, COLLECTION, COUNTER_ID);
}

export function subscribeToUserCount(onCount) {
  return onSnapshot(
    counterRef(),
    (snap) => {
      onCount(snap.exists() ? Number(snap.data()?.count) || 0 : 0);
    },
    () => {
      /* Keep the last known count if the live listener fails. */
    }
  );
}

export function trackUniqueVisitor() {
  if (!trackPromise) {
    trackPromise = trackUniqueVisitorOnce();
  }
  return trackPromise;
}

async function trackUniqueVisitorOnce() {
  if (typeof window === "undefined") return;

  const existingId = window.localStorage.getItem(STORAGE_KEY);
  if (existingId) return existingId;

  const visitorId = crypto.randomUUID();
  const visitorRef = doc(db, COLLECTION, visitorId);

  await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef());
    const next = (counterSnap.exists() ? Number(counterSnap.data()?.count) || 0 : 0) + 1;

    transaction.set(
      counterRef(),
      { count: next, updatedAt: serverTimestamp() },
      { merge: true }
    );
    transaction.set(visitorRef, {
      number: next,
      createdAt: serverTimestamp(),
    });
  });

  window.localStorage.setItem(STORAGE_KEY, visitorId);
  return visitorId;
}
