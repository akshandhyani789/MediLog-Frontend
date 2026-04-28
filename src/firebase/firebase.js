// Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ❌ IMPORTANT: DO NOT use analytics (causes issues on localhost/ngrok)

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDNVkHG-mIGYh-MdUV3_2x9WY4cfEOf6js",
  authDomain: "medilog-95589.firebaseapp.com",
  projectId: "medilog-95589",
  storageBucket: "medilog-95589.firebasestorage.app",
  messagingSenderId: "326571465142",
  appId: "1:326571465142:web:866f45b32450fd2692c917",
  measurementId: "G-QMNRJMSGHK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth instance (use everywhere in frontend)
export const auth = getAuth(app);