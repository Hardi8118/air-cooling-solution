// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa4PC9phXBf9WHmZJHdWhLaRjzPkffMp0",
  authDomain: "air-cooling-solution.firebaseapp.com",
  projectId: "air-cooling-solution",
  storageBucket: "air-cooling-solution.firebasestorage.app",
  messagingSenderId: "1039638233703",
  appId: "1:1039638233703:web:b3be2a7fd47e098ef24ac2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ✅ Aktifkan cache offline
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, offline persistence only available in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('Current browser does not support offline persistence.');
  }
});
export { auth, db };
