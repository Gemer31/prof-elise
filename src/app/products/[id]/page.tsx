import { Product } from '@/app/models';
import { PRODUCTS } from '@/app/constants';

export interface ProductDetailsProps {
  params: {
    id: string;
  }
}

async function getProductDetails(id: string): Promise<Product | undefined> {
  // TODO: request
  return PRODUCTS.find((product) => product.id = id);
}

export default async function ProductDetails({ params: { id } }: ProductDetailsProps) {
  const product: Product | undefined = await getProductDetails(id);

  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      Product {id}
    </main>
  )
}