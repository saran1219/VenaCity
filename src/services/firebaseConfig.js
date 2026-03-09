import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCecK5HNLkL8wboB6NZVMntug61VJYlQ-s",
  authDomain: "venacity-a72ff.firebaseapp.com",
  projectId: "venacity-a72ff",
  storageBucket: "venacity-a72ff.firebasestorage.app",
  messagingSenderId: "606232866505",
  appId: "1:606232866505:web:269c0e3d55f75790192718",
  measurementId: "G-LYQPDMVV06"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
