import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IUser } from '@/app/models';
import { ProfileBase } from '@/components/view/ProfileBase';
import { ProfileMainInfo } from '@/components/view/ProfileMainInfo';

export default async function ProfilePage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect(RouterPath.HOME);
  }

  const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session?.user.email));
  const user: IUser = userDocumentSnapshot.data() as IUser;

  return <>
    <ProfileBase activeRoute={RouterPath.PROFILE}>
      <ProfileMainInfo user={user}/>
    </ProfileBase>
  </>;
}