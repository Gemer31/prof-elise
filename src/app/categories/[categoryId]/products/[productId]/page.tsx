import { ICategory, IConfig, IProduct, IViewedRecently, IViewedRecentlyModel } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { ContentContainer } from '@/components/ContentContainer';
import { ImgGallery } from '@/components/ImgGallery';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import { collection, doc, DocumentReference, getDoc, getDocs, setDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData, getClient, getViewedRecently } from '@/utils/firebase.util';
import { EntityFavouriteButton } from '@/components/EntityFavouriteButton';
import { ProductDetailsActionsBar } from '@/components/ProductDetailsActionsBar';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { cookies } from 'next/headers';
import { CLIENT_ID, COLOR_OPTION_VALUES } from '@/app/constants';
import { ViewedRecently } from '@/components/viewed-recently/ViewedRecently';
import currency from 'currency.js';

export interface IProductDetailsProps {
  params: {
    productId: string;
  };
  searchParams: {
    pageLimit: number;
  };
}

export default async function ProductDetailsPage(
  {params: {productId}, searchParams: {pageLimit}}: IProductDetailsProps
) {
  const clientId: string = cookies().get(CLIENT_ID)?.value;

  const [
    client,
    settingsDocumentSnapshot,
    productDocumentSnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getClient(cookies()),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
    getDoc(doc(db, FirestoreCollections.PRODUCTS, productId)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const viewedRecently: IViewedRecently[] = await getViewedRecently(client);
  const product: IProduct = productDocumentSnapshot.data() as IProduct;
  const productCategory: ICategory = categories.find((item) => product.categoryRef.path.includes(item.id));
  delete product.categoryRef;

  if (clientId && !client?.viewedRecently[productId]) {
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
    await setDoc(
      doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId),
      {
        ...client,
        viewedRecently: newViewedRecentlyObj
      }
    );
  }

  // todo: redirect if not found
  return <>
    <ContentContainer styleClass="flex flex-col items-center">
      <Breadcrumbs links={[
        {title: productCategory?.title, href: `${RouterPath.CATEGORIES}/${productCategory?.id}`},
        {title: product.title}
      ]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <Catalog pageLimit={pageLimit} currentCategoryId={product.categoryId} categories={categories}/>
        </div>
        <div className="w-full flex justify-between">
          <div className="w-full">
            <div className="w-full">
              <div className="mb-4 text-2xl bold">{product?.title}</div>
              <div className="flex">
                <div className="relative">
                  <div className="absolute left-4 top-4 z-10">
                    {
                      product.labels?.map((item, index) => {
                        return <div
                          key={index}
                          className={'px-2 py-1 text-white rounded-md text-xs ' + COLOR_OPTION_VALUES.get(item.color)}
                        >{item.text}</div>;
                      })
                    }
                  </div>
                  <ImgGallery imageUrls={product?.imageUrls}/>
                  <EntityFavouriteButton className="absolute scale-100 top-4 right-2" productId={product.id}/>
                </div>
                <div className="w-full md:ml-4 mt-4 md:mt-0">
                  <div className="text-gray-400 text-base mb-4">
                    {TRANSLATES[LOCALE].vendorCode}: {product.vendorCode}
                  </div>
                  <div className="w-full mb-4 text-2xl text-pink-500 font-bold">
                    {currency(product.price).toString()} {config.currency}
                  </div>
                  <ProductDetailsActionsBar productId={product.id}/>
                </div>
              </div>
            </div>
            <div className="mt-4 ql-editor readonly-ql-editor no-paddings whitespace-pre-line"
                 dangerouslySetInnerHTML={{__html: product?.description || ''}}
            />
          </div>
        </div>
      </div>
    </ContentContainer>
    <ViewedRecently
      viewedRecently={viewedRecently}
      config={config}
    />
  </>;
}