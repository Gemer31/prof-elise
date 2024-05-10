import { ICategory, IProduct } from '@/app/models';
import { Catalog } from '@/components/Catalog';
import { Advantages } from '@/components/Advantages';
import { ProductDetailsActionsBlock } from '@/components/ProductDetailsActionsBlock';
import { ContentContainer } from '@/components/ContentContainer';
import { ImgGallery } from '@/components/ImgGallery';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getCategories, getConfig, getProductsV2 } from '@/app/lib/firebase-api';
import { RouterPath } from '@/app/enums';

export interface IProductDetailsProps {
  params: {
    productId: string;
  };
}

export default async function ProductDetailsPage({params: {productId}}: IProductDetailsProps) {
  const [config, categories, products] = await Promise.all([
    getConfig(),
    getCategories(),
    getProductsV2(),
  ]);
  let product: IProduct = Object.values(products).find((item) => item.id === productId);
  product.categoryId = product.categoryRef.path.split('/').pop();
  delete product.categoryRef;
  const productCategory: ICategory = Object.values(categories).find((item) => product.categoryId === item.id);

  // todo: redirect if not found
  return (
    <main>
      <ContentContainer styleClass="flex flex-col items-center">
        <Breadcrumbs links={[
          {title: productCategory.title, href: `${RouterPath.CATEGORIES}/${productCategory.id}`},
          {title: product.title, href: `${RouterPath.PRODUCTS}/${product.id}`}
        ]}/>
        <div className="w-full flex justify-between mb-4 flex-col-reverse md:flex-row ">
          <div className="w-full md:w-4/12 mr-4">
            <Catalog currentCategoryId={product.categoryId} categories={Object.values(categories)}/>
            <Advantages styleClass="hidden md:block"/>
          </div>
          <div className="w-full flex justify-between">
            <div className="w-full">
              <div className="w-full block md:flex">
                <div className="mb-4 text-2xl bold text-center md:hidden">{product?.title}</div>
                <ImgGallery imageUrls={product?.imageUrls}/>
                <div className="w-full md:ml-4 mt-4 md:mt-0">
                  <div className="mb-4 text-2xl bold text-center hidden md:block">{product?.title}</div>
                  <div
                    className="w-full text-2xl text-pink-500 font-bold text-center">{product?.price} {config.currency}</div>
                  <ProductDetailsActionsBlock product={product}/>
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