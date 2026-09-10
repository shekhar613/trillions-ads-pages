import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_uodT8ZiIvgYRhkM33LFRrTCp5pVfLRw",
  authDomain: "trillions-stock-research.firebaseapp.com",
  projectId: "trillions-stock-research",
  storageBucket: "trillions-stock-research.firebasestorage.app",
  messagingSenderId: "464514261740",
  appId: "1:464514261740:web:283746a89e9d8ebad5fbc9",
  measurementId: "G-S537PETFW3",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);
