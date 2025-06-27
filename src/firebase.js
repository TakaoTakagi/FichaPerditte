import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2xyCO24rgr76x0CYUUIQIjgv0aUHbEbQ",
  authDomain: "perditteficha.firebaseapp.com",
  projectId: "perditteficha",
  storageBucket: "perditteficha.firebasestorage.app",
  messagingSenderId: "681234689710",
  appId: "1:681234689710:web:1654b2b21740267a2a873f"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Autenticação
const auth = getAuth(app);

// Provider do Google para login social
const provider = new GoogleAuthProvider();

// Firestore (banco de dados)
const db = getFirestore(app);

export { auth, db, provider };