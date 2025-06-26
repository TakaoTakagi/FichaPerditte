// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2xyCO24rgr76x0CYUUIQIjgv0aUHbEbQ",
  authDomain: "perditteficha.firebaseapp.com",
  projectId: "perditteficha",
  storageBucket: "perditteficha.firebasestorage.app",
  messagingSenderId: "681234689710",
  appId: "1:681234689710:web:1654b2b21740267a2a873f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
