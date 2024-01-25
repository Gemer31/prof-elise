// import { initializeApp } from 'firebase/app';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
//
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// signOut(auth);
//
//
// const onSubmitForm = async (formData: AppFields) => {
//   setSomethingWentWrongVisible(false);
//   setLoading(true);
//
//   try {
//     const result: UserCredential = await createUserWithEmailAndPassword(
//       auth,
//       formData.email,
//       formData.password
//     );
//     const user = result.user;
//     await addDoc(collection(db, 'users'), {
//       uid: user.uid,
//       name: `${formData.firstName} ${formData.lastName}`,
//       authProvider: 'local',
//       email: formData.email,
//     });
//     navigate(RouterPage.GQL);
//   } catch (e) {
//     setSomethingWentWrongVisible(true);
//   } finally {
//     setLoading(false);
//   }
// };
//
// const onSubmitForm = async (formData: AppFields) => {
//   setCredentialErrorVisible(false);
//   setLoading(true);
//
//   try {
//     await signInWithEmailAndPassword(auth, formData.email, formData.password);
//     navigate(RouterPage.GQL);
//   } catch (err) {
//     setCredentialErrorVisible(true);
//   } finally {
//     setLoading(false);
//   }
// };