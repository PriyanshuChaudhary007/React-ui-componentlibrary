
import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from  "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "virtual-ui.firebaseapp.com",
  projectId: "virtual-ui",
  storageBucket: "virtual-ui.firebasestorage.app",
  messagingSenderId: "758642001336",
  appId: "1:758642001336:web:1fd47ea064b088aa97bb4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}