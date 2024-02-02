'use client'

import { LOCALE, TRANSLATES } from '@/app/translates';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import { addProductToCart, ICartProductData, removeProductFromCart } from '@/store/dataSlice';
import { Counter } from '@/components/Counter';
import Link from 'next/link';
import { RouterPath } from '@/app/enums';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.dataReducer.cart);

  // const [firestoreData, storageData] = await Promise.all([
  //   getDocs(collection(db, FIREBASE_DATABASE_NAME)),
  //   listAll(ref(storage))
  // ]);
  // const categories: ICategory[] = convertCategoriesDataToModelArray(getDocData<IFirestoreFields>(
  //   firestoreData?.docs,
  //   FirebaseCollections.CATEGORIES
  // ));
  // const config: IConfig = convertConfigDataToModel(getDocData<IFirestoreConfigEditorInfo>(
  //   firestoreData.docs,
  //   FirebaseCollections.CONFIG
  // ));

  const updateProductsCount = (productData: ICartProductData, amount: number) => {
    dispatch(addProductToCart({
      ...productData,
      amount,
      addToExist: false,
    }));
  }



  return (
    <ContentContainer>
      {
        cart.totalProductsAmount
          ? Object.values<ICartProductData>(cart.products)?.map((productData: ICartProductData, index) => {
            return <div className="flex justify-between items-center">
              <div className="w-2/12">
                <Image
                  width={100}
                  height={100}
                  src={productData.data.imageUrls?.[0] || ''}
                  alt={productData.data.title}
                />
              </div>
              <Link
                className="w-3/12"
                href={`${RouterPath.CATEGORIES}/${productData.data?.categoryId}${RouterPath.PRODUCTS}/${productData.data?.id}`}
              >{productData.data.title}</Link>
              <div className="w-2/12">
                <Counter
                  selectedAmount={productData.amount}
                  counterChangedCallback={(newAmount) => updateProductsCount(productData, newAmount)}
                />
              </div>
              <div className="w-2/12">{productData.data.price}</div>
              <div className="w-2/12">{productData.data.price * productData.amount}</div>
              <div className="w-1/12">
                <Image
                  className="cursor-pointer"
                  width={40}
                  height={40}
                  src="/icons/cross.svg"
                  alt="Close"
                  onClick={() => dispatch(removeProductFromCart(productData.data.id))}
                />
              </div>
            </div>
          })
          : <div>{TRANSLATES[LOCALE].emptyCart}</div>
      }
    </ContentContainer>
  )
}