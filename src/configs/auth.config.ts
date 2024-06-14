import { AuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';
import { cookies } from 'next/headers';
import { auth, db } from '@/app/lib/firebase-config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { CLIENT_ID } from '@/app/constants';
import { IUser } from '@/app/models';

export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials) {
        try {
          await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, credentials.email));
          const userData: IUser = userDocumentSnapshot.data() as IUser;
          cookies().set(CLIENT_ID, userData.clientId);
          return userData as unknown as User;
        } catch (e) {
          return null;
          // console.error('Login failed: ', e);
        }
      },
    }),
  ],
  pages: {
    signIn: RouterPath.SIGN_IN,
  },
};
