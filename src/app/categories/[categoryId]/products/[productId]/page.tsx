import { ICategory, IConfig, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { ContentContainer } from '@/components/ContentContainer';
import { ImgGallery } from '@/components/ImgGallery';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData } from '@/utils/firebase.util';
import { EntityFavouriteButton } from '@/components/EntityFavouriteButton';
import { ProductDetailsActionsBar } from '@/components/ProductDetailsActionsBar';
import { LOCALE, TRANSLATES } from '@/app/translates';

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
  const [
    settingsQuerySnapshot,
    categoriesQuerySnapshot,
    productDocumentSnapshot
  ] = await Promise.all([
    getDocs(collection(db, FirestoreCollections.SETTINGS)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES)),
    getDoc(doc(db, FirestoreCollections.PRODUCTS, productId))
  ]);
  const config = settingsQuerySnapshot.docs[0].data() as IConfig;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);
  const product: IProduct = productDocumentSnapshot.data() as IProduct;
  const productCategory: ICategory = categories.find((item) => product.categoryRef.path.includes(item.id));
  delete product.categoryRef;

  // todo: redirect if not found
  return (
    <main>
      <ContentContainer styleClass="flex flex-col items-center">
        <Breadcrumbs links={[
          {title: productCategory?.title, href: `${RouterPath.CATEGORIES}/${productCategory?.id}`},
          {title: product.title, href: `${RouterPath.PRODUCTS}/${product.id}`}
        ]}/>
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <div className="w-full md:w-4/12 mr-4">
            <Catalog pageLimit={pageLimit} currentCategoryId={product.categoryId} categories={categories}/>
            <Advantages styleClass="hidden md:block"/>
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
                            className={'px-2 py-1 text-white rounded-md text-xs ' + item.color}
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
    </main>
  );
}