import { ContentContainer } from '@/components/ui/ContentContainer';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IUser } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';

export default async function ProfilePage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect(RouterPath.HOME);
  }

  const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session?.user.email));
  const user: IUser = userDocumentSnapshot.data() as IUser;

  return <>
    <ContentContainer styleClass="flex flex-col items-center px-2 mb-4">
      <fieldset>
        <legend>{TRANSLATES[LOCALE].userData}</legend>
        <div>

        </div>
      </fieldset>
    </ContentContainer>
  </>;
}