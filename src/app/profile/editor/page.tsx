import { AdminEditor } from '@/components/admin/AdminEditor';
import { ProfileBase } from '@/components/view/ProfileBase';
import { FirestoreCollections, RouterPath, UserRoles } from '@/app/enums';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IUser } from '@/app/models';

export default async function EditorPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect(RouterPath.HOME);
  }

  const userQuerySnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session.user.email));
  const user = (userQuerySnapshot.data() as IUser);

  if (user.role !== UserRoles.ADMIN) {
    redirect(RouterPath.HOME);
  }

  return <>
    <ProfileBase activeRoute={RouterPath.EDITOR} userRole={user.role}>
      <AdminEditor/>
    </ProfileBase>
  </>
}