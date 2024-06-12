import { LOCALE, TRANSLATES } from '@/app/translates';
import { FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import { IConfig, IProductSerialized, IViewedRecentlyModel } from '@/app/models';
import Image from 'next/image';
import { ContentContainer } from '@/components/ui/ContentContainer';
import Link from 'next/link';
import './viewed-recently.css';
import currency from 'currency.js';
import { getEnrichedViewedRecently, getViewedRecently } from '@/utils/firebase.util';
import { cookies } from 'next/headers';
import { doc, DocumentReference, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { CLIENT_ID } from '@/app/constants';
import { setViewedRecently } from '@/store/asyncThunk';
import { revalidateViewedRecently } from '@/app/actions';

interface IViewedRecentlyProps {
  product?: IProductSerialized;
}

export async function ViewedRecently({product}: IViewedRecentlyProps) {
  const clientId: string = cookies().get(CLIENT_ID)?.value;

  const [
    viewedRecently,
    settingsDocumentSnapshot
  ] = await Promise.all([
    getViewedRecently(clientId),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG))
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  let viewedRecentlyEnriched = await getEnrichedViewedRecently(viewedRecently);
  viewedRecentlyEnriched = viewedRecentlyEnriched.sort((a, b) => {
    return b.time - a.time;
  });

  if (clientId && product && !viewedRecently[product?.id]) {
    const newViewRecently: IViewedRecentlyModel<IProductSerialized | string>[] = [...viewedRecentlyEnriched];
    if (newViewRecently.length > 4) {
      newViewRecently.pop();
    }
    newViewRecently.unshift({
      time: +new Date(),
      productRef: product.id
    });
    const newViewedRecentlyObj: Record<string, IViewedRecentlyModel<DocumentReference>> = {};
    newViewRecently.forEach(item => {
      const productId: string = typeof item.productRef === 'string' ? item.productRef : item.productRef.id;
      newViewedRecentlyObj[productId] = {
        time: item.time,
        productRef: doc(db, FirestoreCollections.PRODUCTS, productId)
      };
    });
    await setViewedRecently(clientId, newViewedRecentlyObj);

    await revalidateViewedRecently();
  }

  return viewedRecentlyEnriched?.length
    ? <div className="w-full bg-slate-100 flex flex-col items-center h-full py-4">
      <ContentContainer type="article" styleClass="px-2">
        <h2 className="text-xl font-bold">{TRANSLATES[LOCALE].youViewed}</h2>
        <div className="py-2 grid grid-cols-5 gap-x-2">
          {
            viewedRecentlyEnriched.map(item => {
                return <Link
                  href={`${RouterPath.CATEGORIES}/${item.productRef?.categoryRef}${RouterPath.PRODUCTS}/${item.productRef?.id}`}
                  key={item.productRef?.id}
                  className="flex items-center p-4 rounded-md bg-white hover:bg-pink-200 duration-500 transition-colors"
                >
                  <Image width={55} height={55} src={item.productRef?.imageUrls[0]} alt={item.productRef?.title}/>
                  <div className="ml-2">
                    <div className="viewed-recently__card-title text-base">{item.productRef?.title}</div>
                    <div className="font-light">{currency(item.productRef?.price).toString()} {config.currency}</div>
                  </div>
                </Link>;
              })
          }
        </div>
      </ContentContainer>
    </div>
    : <></>;
}