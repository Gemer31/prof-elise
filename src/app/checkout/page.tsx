import { Metadata } from 'next';
import { doc, DocumentSnapshot, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, FirestoreDocuments } from '@/app/enums';
import { IConfig, IUser } from '@/app/models';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { CheckoutForm } from '@/components/view/checkout-form/CheckoutForm';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { SubHeader } from '@/components/view/SubHeader';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Расходные материалы в Могилеве'
};

export default async function CheckoutPage() {
  const session = await getServerSession();

  const [userDocumentsSnapshot, settingsDocumentSnapshot] = await Promise.all([
    session?.user?.email ? getDoc(doc(db, FirestoreCollections.USERS, session.user.email)) : Promise.resolve(),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
  ])
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const user: IUser = session?.user?.email ? (userDocumentsSnapshot as DocumentSnapshot).data() as IUser : null;

  delete user?.cartAndFavouritesRef;
  delete user?.orders;

  return <>
    <SubHeader config={config}/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[
        {title: TRANSLATES[LOCALE].orderCreation}
      ]}/>
      <article className="w-full">
        <CheckoutForm config={config} user={user}/>
      </article>
    </ContentContainer>
    <ViewedRecently/>
  </>;
}