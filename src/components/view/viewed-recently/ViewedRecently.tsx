import { LOCALE, TRANSLATES } from '@/app/translates';
import { FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import { IConfig, IProductSerialized, IViewedRecently, IViewedRecentlyModel } from '@/app/models';
import Image from 'next/image';
import { ContentContainer } from '@/components/ui/ContentContainer';
import Link from 'next/link';
import './viewed-recently.css';
import currency from 'currency.js';
import { getClientData, getEnrichedViewedRecently } from '@/utils/firebase.util';
import { cookies } from 'next/headers';
import { doc, DocumentReference, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { CLIENT_ID } from '@/app/constants';
import { setViewedRecently } from '@/store/asyncThunk';

interface IViewedRecentlyProps {
  product?: IProductSerialized;
}

export async function ViewedRecently({product}: IViewedRecentlyProps) {
  const clientId: string = cookies().get(CLIENT_ID)?.value;

  const [
    viewedRecentlyRes,
    settingsDocumentSnapshot
  ] = await Promise.all([
    getClientData<Record<string, IViewedRecentlyModel>>(FirestoreCollections.VIEWED_RECENTLY, cookies()),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG))
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const viewedRecently: IViewedRecently[] = await getEnrichedViewedRecently(viewedRecentlyRes);

  if (clientId && product && !viewedRecentlyRes[product?.id]) {
    const newViewRecently = [...viewedRecently];
    if (newViewRecently.length > 4) {
      newViewRecently.pop();
    }
    newViewRecently.unshift({
      time: +new Date(),
      product
    });
    const newViewedRecentlyObj: Record<string, IViewedRecentlyModel<DocumentReference>> = {};
    newViewRecently.forEach(item => {
      newViewedRecentlyObj[item.product.id] = {
        time: item.time,
        productRef: doc(db, FirestoreCollections.PRODUCTS, item.product.id)
      };
    });
    await setViewedRecently(clientId, newViewedRecentlyObj)
  }

  return viewedRecently?.length
    ? <div className="w-full bg-slate-100 flex flex-col items-center h-full py-4">
      <ContentContainer type="article" styleClass="px-2">
        <h2 className="text-xl font-bold">{TRANSLATES[LOCALE].youViewed}</h2>
        <div className="py-2 grid grid-cols-5 gap-x-2">
          {
            viewedRecently
              .sort((a, b) => b.time - a.time)
              .map(item => {
                return <Link
                  href={`${RouterPath.CATEGORIES}/${item.product?.categoryRef}${RouterPath.PRODUCTS}/${item.product?.id}`}
                  key={item.product?.id}
                  className="flex items-center p-4 rounded-md bg-white hover:bg-pink-200 duration-500 transition-colors"
                >
                  <Image width={55} height={55} src={item.product?.imageUrls[0]} alt={item.product?.title}/>
                  <div className="ml-2">
                    <div className="viewed-recently__card-title text-base">{item.product?.title}</div>
                    <div className="font-light">{currency(item.product?.price).toString()} {config.currency}</div>
                  </div>
                </Link>;
              })
          }
        </div>
      </ContentContainer>
    </div>
    : <></>;
}