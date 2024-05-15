import { AboutUs } from '@/components/AboutUs';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { CategoriesList } from '@/components/CategoriesList';
import { docsToData, getViewedRecently } from '@/utils/firebase.util';
import { ICategory, IConfig, IViewedRecently } from '@/app/models';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { ButtonTypes, FirestoreCollections, RouterPath } from '@/app/enums';
import { BasePage } from '@/components/BasePage';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { CLIENT_ID } from '@/app/constants';
import { IClient } from '@/store/dataSlice';

export interface IHomePageProps {
  searchParams: {
    pageLimit: number;
  };
}

export default async function HomePage({searchParams: {pageLimit}}: IHomePageProps) {
  const clientId: string = cookies().get(CLIENT_ID)?.value;

  const [
    clientDataDocumentSnapshot,
    settingsQuerySnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId)),
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const client: IClient = clientDataDocumentSnapshot.data() as IClient;
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);

  return <BasePage viewedRecently={viewedRecently} config={config} sliderVisible={true}>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].popularCategories}</h2>
          <Button type={ButtonTypes.BUTTON}>
            <Link className="flex px-4 py-2" href={RouterPath.CATEGORIES}>{TRANSLATES[LOCALE].allCategories}</Link>
          </Button>
        </div>
        <CategoriesList data={Object.values(categories)} pageLimit={Number(pageLimit)}/>
      </div>
      {/*<Advantages/>*/}
      <AboutUs text={config.shopDescription}/>
    </ContentContainer>
  </BasePage>;
}
