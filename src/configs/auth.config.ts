import { AuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, UserCredential } from '@firebase/auth';
import { auth, db } from '@/app/lib/firebase-config';
import { doc, getDoc } from '@firebase/firestore';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';
import { IUser } from '@/app/models';

export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {label: 'email', type: 'email', required: true},
        password: {label: 'password', type: 'password', required: true}
      },
      async authorize(credentials) {
        try {
          const userCred: UserCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, credentials.email));
          const userData: IUser = userDocumentSnapshot.data() as IUser;
          cookies().set(CLIENT_ID, userData.cartAndFavouritesRef.id)
          return userData as unknown as User;
        } catch (e) {
          return null;
          // console.error('Login failed: ', e);
        }
      }
    })
  ],
  pages: {
    signIn: RouterPath.SIGN_IN
  }
};