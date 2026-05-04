import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyDOIY5pwHpW2eWpq2UAHjBPn6jf2CN47UA",
  authDomain: "bizforsale-6d902.firebaseapp.com",
  projectId: "bizforsale-6d902",
  storageBucket: "bizforsale-6d902.firebasestorage.app",
  messagingSenderId: "837111595220",
  appId: "1:837111595220:web:6c2cb75b506ebe26937b41",
};

let firebaseApp;

export function getFirebaseApp() {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }

  return firebaseApp;
}

export const app = getFirebaseApp();
