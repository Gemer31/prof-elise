import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBgznHXUqUi3ehk_ZjOMtzZGO6E77Azo84",
  authDomain: "prof-elise.firebaseapp.com",
  projectId: "prof-elise",
  storageBucket: "prof-elise.appspot.com",
  messagingSenderId: "582836420623",
  appId: "1:582836420623:web:e91e74bd6e0358d807237a",
  measurementId: "G-TYFTE3WSC9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage(app, 'gs://prof-elise.appspot.com');
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);

