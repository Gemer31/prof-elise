import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IUser, IUserSerialized } from '@/app/models';
import { ProfileBase } from '@/components/view/ProfileBase';
import { ProfileMainInfo } from '@/components/view/ProfileMainInfo';
import { SerializationUtil } from '@/utils/serialization.util';

export default async function ProfilePage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect(RouterPath.HOME);
  }

  const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session?.user.email));
  const userSerialized: IUserSerialized = SerializationUtil.getSerializedUser(userDocumentSnapshot.data() as IUser);

  return <>
    <ProfileBase activeRoute={RouterPath.PROFILE} userRole={userSerialized.role}>
      <ProfileMainInfo userServer={userSerialized}/>
    </ProfileBase>
  </>;
}