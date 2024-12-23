// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


//old project works 
// const firebaseConfig = {
//   apiKey: "AIzaSyBzZXlBJuGkh1zpXpIFtXwZxDWb00YnsuA",
//   authDomain: "fir-4-uploadfiles.firebaseapp.com",
//   projectId: "fir-4-uploadfiles",
//   storageBucket: "fir-4-uploadfiles.appspot.com",
//   messagingSenderId: "567145842088",
//   appId: "1:567145842088:web:23e5e367fe348662aac99d",
//   measurementId: "G-42MH6HYYCY"
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);