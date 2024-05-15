import { ICategory, IConfig, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { ContentContainer } from '@/components/ContentContainer';
import { ImgGallery } from '@/components/ImgGallery';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FirestoreCollections, FirestoreDocuments, RouterPath } from '@/app/enums';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData } from '@/utils/firebase.util';
import { EntityFavouriteButton } from '@/components/EntityFavouriteButton';
import { ProductDetailsActionsBar } from '@/components/ProductDetailsActionsBar';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { BasePage } from '@/components/BasePage';
import { IClient } from '@/store/dataSlice';
import { cookies } from 'next/headers';
import { CLIENT_ID, COLOR_OPTION_VALUES } from '@/app/constants';

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
  // let client: IClient;

  const [
    clientData,
    settingsDocumentSnapshot,
    productDocumentSnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId)),
    // clientId
    //   ? getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId))
    //   .then((res) => {
    //     client = res.data() as IClient;
    //     const viewedRecentlyProductsIds: string[] = Object.keys(client.viewedRecently);
    //     if (viewedRecentlyProductsIds?.length) {
    //       return getDocs(query(
    //         collection(db, FirestoreCollections.PRODUCTS),
    //         where('id', 'in', viewedRecentlyProductsIds)
    //       ));
    //     } else {
    //       return Promise.resolve([]);
    //     }
    //   })
    //   : Promise.resolve(),
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
    getDoc(doc(db, FirestoreCollections.PRODUCTS, productId)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const client: IClient = clientData.data() as IClient;
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const product: IProduct = productDocumentSnapshot.data() as IProduct;
  const productCategory: ICategory = categories.find((item) => product.categoryRef.path.includes(item.id));
  delete product.categoryRef;


  console.log(client.viewedRecently);
  // todo: redirect if not found
  return <BasePage config={config}>
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
                  <EntityFavouriteButton className="scale-100 top-4 right-2" productId={product.id}/>
                </div>
                <div className="w-full md:ml-4 mt-4 md:mt-0">
                  <div className="text-gray-400 text-base mb-4">
                    {TRANSLATES[LOCALE].vendorCode}: {product.vendorCode}
                  </div>
                  <div className="w-full mb-4 text-2xl text-pink-500 font-bold">
                    {product?.price} {config.currency}
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
  </BasePage>;
}