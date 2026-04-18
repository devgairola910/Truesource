import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQdIa3nIqTtyyyn2mKRI44afSq90RsLqw",
  authDomain: "truesource-platform.firebaseapp.com",
  projectId: "truesource-platform",
  storageBucket: "truesource-platform.firebasestorage.app",
  messagingSenderId: "634443967761",
  appId: "1:634443967761:web:7d027d93b99cd635f1b0b0",
  measurementId: "G-B8TFDCDDT8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
