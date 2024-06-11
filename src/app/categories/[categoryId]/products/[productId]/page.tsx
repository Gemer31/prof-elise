import { ICategory, IConfig, IProduct, IProductSerialized } from '@/app/models';
import { Catalog } from '@/components/view/Catalog';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { ImgGallery } from '@/components/view/ImgGallery';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { FirestoreCollections, FirestoreDocuments, PageLimits, RouterPath } from '@/app/enums';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { docsToData } from '@/utils/firebase.util';
import { EntityFavouriteButton } from '@/components/view/EntityFavouriteButton';
import { ProductDetailsActionsBar } from '@/components/view/ProductDetailsActionsBar';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { COLOR_OPTION_VALUES } from '@/app/constants';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import currency from 'currency.js';
import { SubHeader } from '@/components/view/SubHeader';
import { notFound } from 'next/navigation';
import { SerializationUtil } from '@/utils/serialization.util';
import { getPaginateUrl } from '@/utils/router.util';

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
    settingsDocumentSnapshot,
    productDocumentSnapshot,
    categoriesQuerySnapshot
  ] = await Promise.all([
    getDoc(doc(db, FirestoreCollections.SETTINGS, FirestoreDocuments.CONFIG)),
    getDoc(doc(db, FirestoreCollections.PRODUCTS, productId)),
    getDocs(collection(db, FirestoreCollections.CATEGORIES))
  ]);
  const config: IConfig = settingsDocumentSnapshot.data() as IConfig;
  const categories = docsToData<ICategory>(categoriesQuerySnapshot.docs);

  const product: IProductSerialized = SerializationUtil.getSerializedProduct(productDocumentSnapshot.data() as IProduct);
  if (!product) {
    notFound();
  }

  const productCategory: ICategory = categories.find((item) => product.categoryRef.includes(item.id));
  if (!productCategory) {
    notFound();
  }

  return <>
    <SubHeader config={config}/>
    <ContentContainer styleClass="flex flex-col items-center">
      <Breadcrumbs links={[
        {
          title: productCategory?.title,
          href: getPaginateUrl({
            baseRedirectUrl: `${RouterPath.CATEGORIES}/${productCategory?.id}`,
            page: 1,
            pageLimit: Number(PageLimits.SIX)
          })
        },
        {title: product.title}
      ]}/>
      <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
        <div className="w-full md:w-4/12 mr-4">
          <div className="sticky top-20">
            <Catalog pageLimit={pageLimit} currentCategoryId={product.categoryRef} categories={categories}/>
          </div>
        </div>
        <article className="w-full flex justify-between">
          <div className="w-full bg-slate-100 rounded-md p-4">
            <section className="w-full">
              <div className="mb-4 text-2xl bold">{product?.title}</div>
              <div className="flex">
                <div className="relative rounded-md">
                  <div className="absolute left-4 top-4 z-10">
                    {
                      product.labels?.map((item, index) => {
                        return <div
                          key={index}
                          className={'px-2 py-1 text-white rounded-md text-xs pointer-events-none ' + COLOR_OPTION_VALUES.get(item.color)}
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
                  <ProductDetailsActionsBar product={product}/>
                </div>
              </div>
            </section>
            <section className="mt-4 ql-editor readonly-ql-editor no-paddings whitespace-pre-line"
                     dangerouslySetInnerHTML={{__html: product?.description || ''}}
            />
          </div>
        </article>
      </div>
    </ContentContainer>
    <ViewedRecently product={product}/>
  </>;
}