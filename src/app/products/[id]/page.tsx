'use client';

import { Product } from '@/app/models';
import { CURRENCY, PRODUCTS } from '@/app/constants';
import { Categories } from '@/components/categories/Categories';
import { Advantages } from '@/components/Advantages';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Counter } from '@/components/Counter';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';

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



  // todo: redirect if not found
  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <div className="w-full flex justify-between">
        <div className="w-4/12 mr-4">
          <Categories/>
          <Advantages/>
        </div>
        <div className="w-full">
          <div className="mb-4 text-2xl bold">{product?.name}</div>
          <div className="w-full flex">
            <div>
              <Image width={500} height={500} src={product?.image || ''} alt={product?.name || ''}/>
            </div>
            <div className="w-full ml-4">
              <div className="w-full text-2xl text-pink-500 font-bold text-center">{product?.price} {CURRENCY}</div>
              <div className="flex justify-between items-center my-4">
                <Counter/>
                <Button
                  styleClass="uppercase text-amber-50 px-4 py-2"
                  type={ButtonType.BUTTON}
                >{TRANSLATES[LOCALE].intoCart}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}