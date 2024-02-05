import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// {
//   "type": "service_account",
//   "project_id": "prof-elise",
//   "private_key_id": "5621a53b7b5c6e3ef6f9f0242377fdc77f15e34b",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCVb4TKut59V8Ov\njRns0bnTlMSDPkzoJtwJ2/imFAYQJmeXBdkM8ZiE4JS3JB0sx0+MulJzZdTBCVjl\nROFIkyrtcCEXoTELJZIHzpEIT3c6Ql//7j3Cmh0nIlp0MOJc5im5tPvKb/xuRu99\nkReJFcpy/wmZ4v9rEhyBN/3xoYCKaEWUR1Y7+TeyQQgauyMZKz4YZpYsfkGS1rg8\nvsO/YMEYU9mkEurwXlhmyPwoQZ2tzfBRdf4aMCHOXI/j+hCwPN+fH0SMhSBvZoJn\nj5bde1ezEXisOC18L2r8/Y+CSmSC4ooovg2Ru8WBUfJ7Xcr5aWIESf3VLCJ51VwY\nvBk2ex2bAgMBAAECggEAQUjkq0sDe6AVmkLbQiaH+CMkzS+xGrUraVVEJo5V7cVR\neV2xKyH7X4XcArzQ0CjNHK6j6c1hqunh/9vdTj8ZQH09v9yImBWUXDvHCenprTal\nSSL0sWlx9hBgkyVuJ2bYcMzcOd892ZG8/E8giJ/P//hi4euVadoSQPPMyj0j8pMb\nP3fSYj3B80OMIhIpQoISw6nlhSusJyGMYkUYhgc1AZjZqZckOBW1tfhVnstnSwgA\nxTWtIspjHyi3CWfmQJ835riv/QV5J+b1DsycOhtfRVJwRo+TxchKWhGmruXR5Ad2\nDmxMHERc6lStsrWctoB1MBm92MuqaL7+QRqZqLBlNQKBgQDN1IAFpmfV6Ti9VniK\nIS4zgf0lcz7RuOgEm1MvggjOMLqyIF5w5GymLa8RHo5exAh8WDVzeMf4uvGbjOuP\n34XPtymqXVjlcmkD23cij8Raju7HTnZKthGg1jgdjcohTcTpfvRTG8BUBXKOVJ5i\n5jKwpEJpaB4lV8FIZsA11/iPrwKBgQC53BX2gWwPR7hk97/4+lGxuAU5x4MC+d5c\ni3zWYYyDjFmhF83oP9ky+YiK1Xly9L1QV08/KHoXwsPgnoGg8NrAL9dkfrWmj5pA\nd1iRJDfBssSl/jesmtltsjtL/qmk8M1DaFStxdGEMQ1Dh8d/wBX1GqxgIzRl+5+J\njYXkrAi/1QKBgCq4KgICMZbiGtahNc9lZ5NlLUcyjh01BWK/YhqAIJe64WTK9w7z\nOeGbpbQl5WKhySkVnbJjpQ1or3CbZOCtgbZEy68CRMsKXeVhDW7s69HnzIMtM7v5\n4drB20+29/bFj1Lu+IKvRdGqd8Y2pdDc+jRTQz1hULBrcEA4ozgJpRsdAoGAeaAb\nw0eodkth0LkMKJtusJUS3l/ATUdEi11AoW4OrNtAoBnaxjxaH3CKOQg/xMmBxbyN\nAHC1jS0IT8qKW86h6BimpH4C02+v6rXvAHQqBJi+9T1qI4rl9FIpWa7aRzTJrm3s\n1Bba593Npz6IgAIsnEwLN5JyLLbADRzO3PjzdM0CgYAzakH0Jfmadu80zdqiCcNr\nVHSk47NLY5PYHNlJUiKsUCPeUkw7X+TL1Nj6aeEQwaTvpgUeco6WHmtq10g/kRQ0\nC86poIKKpr4J+jjAtHRgAts9ZRgUJM8eRlqvqzqZSnmgPmtxoigaxszZ3s4lZxDY\n3hIXMnHfyrIyTDv70FIJOg==\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-1le9o@prof-elise.iam.gserviceaccount.com",
//   "client_id": "101675531175269221911",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1le9o%40prof-elise.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app, 'gs://prof-elise.appspot.com');
export const db = getFirestore(app);

export const provider = new GoogleAuthProvider();
// export const analytics = getAnalytics(app);

