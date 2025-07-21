import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ✅ Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyDDZDsm9AsotXJ5HneK9DVotE3ryMOSc9U",
  authDomain: "newcityhardware-5b084.firebaseapp.com",
  projectId: "newcityhardware-5b084",
  storageBucket: "newcityhardware-5b084.firebasestorage.app", // ✅ Corrected bucket domain
  messagingSenderId: "482049771222",
  appId: "1:482049771222:web:639cd02e8d15b3e432eb77"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Export Firebase Storage
export const googleProvider = new GoogleAuthProvider();
