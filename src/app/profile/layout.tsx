import { Metadata } from 'next';
import { SubHeader } from '@/components/view/SubHeader';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { ColorOptions, FirestoreCollections, RouterPath } from '@/app/enums';
import { Button } from '@/components/ui/Button';
import { ContentContainer } from '@/components/ui/ContentContainer';
import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IUser } from '@/app/models';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Одноразовая продукция и расходные материалы для салонов и медицинских учреждений в Могилеве',
  description: 'Расходные материалы в Могилеве'
};

export default async function ProfileLayout({children}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect(RouterPath.HOME);
  }

  const fullUrl = headers().get('referer');
  console.log(fullUrl)
  const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session?.user.email));
  const user: IUser = userDocumentSnapshot.data() as IUser;

  return <>
    <SubHeader/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].privateAccount}]}/>
      <h1 className="w-full text-2xl font-medium py-2">{TRANSLATES[LOCALE].privateAccount}</h1>
      <section className="w-full flex justify-between">
        <div className="flex gap-x-4">
          <Button
            color={ColorOptions.GRAY}
            styleClass={'flex px-4 py-2 ' + (!fullUrl.split(RouterPath.PROFILE)?.[1] ? 'underline' : '')}
            href={RouterPath.PROFILE}
          >{TRANSLATES[LOCALE].mainInfo}</Button>
          <Button
            color={ColorOptions.GRAY}
            styleClass={'flex px-4 py-2 ' + (fullUrl.includes(RouterPath.ORDERS) ? 'underline' : '')}
            href={RouterPath.ORDERS}
          >{TRANSLATES[LOCALE].orders}</Button>
          <Button
            color={ColorOptions.GRAY}
            styleClass={'flex px-4 py-2 ' + (fullUrl.includes(RouterPath.EDITOR) ? 'underline' : '')}
            href={RouterPath.EDITOR}
          >{TRANSLATES[LOCALE].editor}</Button>
        </div>
        <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={RouterPath.ORDERS}
        >{TRANSLATES[LOCALE].exit}</Button>
      </section>
      <div>
        {children}
      </div>
    </ContentContainer>
  </>
}
