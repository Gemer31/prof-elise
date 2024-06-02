import { ContentContainer } from '@/components/ui/ContentContainer';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import Link from 'next/link';
import { docsToData } from '@/utils/firebase.util';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { ICategory, IConfig } from '@/app/models';
import { SubHeader } from '@/components/view/SubHeader';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { Catalog } from '@/components/view/Catalog';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import Image from 'next/image';

export default async function NotFound() {
  const [
    settingsQuerySnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories: ICategory[] = docsToData<ICategory>(categoriesQuerySnapshot.docs);

  return <>
    <SubHeader config={config}/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].pageIsNotFound}]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row">
        <section className="w-full md:w-4/12 mr-4">
          <div className="sticky top-20">
            <Catalog categories={Object.values(categories)}/>
          </div>
        </section>
        <section className="w-8/12 flex justify-center items-center gap-x-6">
          <Image width={150} height={150} src="/icons/not-found.svg" alt="Arrow"/>
          <div className="flex flex-col gap-y-2">
            <span className="text-2xl text-pink-500">{TRANSLATES[LOCALE].pageIsNotFound}</span>
            <p>
              {TRANSLATES[LOCALE].wrongURLAddress}:
              <br/>1. {TRANSLATES[LOCALE].wrongURLAddress}
              <br/>2. {TRANSLATES[LOCALE].pageDoesNotAvailable}
              <br/>3. {TRANSLATES[LOCALE].pageDoesNotExist}
            </p>
            <Link
              className="text-pink-500 hover:text-pink-400 text-xl duration-500 transition-colors"
              href={RouterPath.HOME}
            >{TRANSLATES[LOCALE].returnToCatalog}</Link>
          </div>
        </section>
      </div>
    </ContentContainer>
    <ViewedRecently/>
  </>;
}

