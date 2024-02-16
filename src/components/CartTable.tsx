'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { ICartProductData, IConfig } from '@/app/models';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonType, RouterPath } from '@/app/enums';
import { Counter } from '@/components/Counter';
import { Button } from '@/components/Button';
import { addProductToCart, removeProductFromCart } from '@/store/dataSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/Loader';

interface ICartTableProps {
  editable?: boolean;
  firestoreConfigData: IConfig;
}

export function CartTable({firestoreConfigData, editable}: ICartTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.dataReducer.cart);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);

  const updateProductsCount = (productData: ICartProductData, amount: number) => {
    dispatch(addProductToCart({
      ...productData,
      amount,
      addToExist: false
    }));
  };

  return cartLoading
    ? <div className="w-full flex justify-center mt-4 overflow-hidden">
      <Loader styleClass="min-h-[250px] border-pink-500"
      /></div>
    : cart.totalProductsAmount
      ? (
        <div>
          <table className="w-full">
            <thead>
            <tr>
              <td className="w-2/12 text-center hidden sm:table-cell">{TRANSLATES[LOCALE].picture}</td>
              <td className="w-4/12">{TRANSLATES[LOCALE].productName}</td>
              <td className="w-2/12">{TRANSLATES[LOCALE].shortAmountText}</td>
              <td className="w-2/12 text-end">{TRANSLATES[LOCALE].priceForOneProduct}</td>
              <td className="w-2/12 text-end hidden sm:table-cell">{TRANSLATES[LOCALE].all}</td>
            </tr>
            </thead>
            <tbody>
            {
              Object.values<ICartProductData>(cart.products)?.map((productData: ICartProductData, index) => {
                return <tr key={productData.data.id}>
                  <td className="justify-center items-center hidden sm:flex">
                    <Image
                      width={100}
                      height={100}
                      src={productData.data.imageUrls?.[0] || ''}
                      alt={productData.data.title}
                    />
                  </td>
                  <td>
                    <Link
                      className="w-4/12"
                      href={`${RouterPath.CATEGORIES}/${productData.data?.categoryId}${RouterPath.PRODUCTS}/${productData.data?.id}`}
                    >{productData.data.title}</Link>
                  </td>
                  <td className="">
                    <div className="flex flex-col items-center justify-center">
                      {
                        editable
                          ? <>
                            <Counter
                              selectedAmount={productData.amount}
                              counterChangedCallback={(newAmount) => updateProductsCount(productData, newAmount)}
                            />
                            <Button
                              styleClass="w-full text-base uppercase text-amber-50 px-4 py-2 mt-2"
                              type={ButtonType.BUTTON}
                              callback={() => dispatch(removeProductFromCart(productData.data.id))}
                            >{TRANSLATES[LOCALE].delete}</Button>
                          </>
                          : <>{productData.amount}</>
                      }
                    </div>
                  </td>
                  <td className="w-2/12 text-end">{productData.data.price} {firestoreConfigData.currency}</td>
                  <td
                    className="w-2/12 text-end hidden sm:table-cell">{productData.data.price * productData.amount} {firestoreConfigData.currency}</td>
                </tr>;
              })
            }
            </tbody>
          </table>
          <div className={`flex items-center text-2xl mt-4 ${editable ? 'justify-between' : 'justify-end'}`}>
            <div className="flex">
              <span className="bold">{TRANSLATES[LOCALE].result}</span>
              :
              <span className="ml-4">{cart.totalProductsPrice} {firestoreConfigData.currency}</span>
            </div>
            {
              editable
                ? <Button
                  styleClass="w-fit text-base uppercase text-amber-50 px-4 py-2 mt-2 w-fit"
                  type={ButtonType.BUTTON}
                  callback={() => router.push(RouterPath.CHECKOUT)}
                >{TRANSLATES[LOCALE].createOrder}</Button>
                : <></>
            }
          </div>
        </div>
      )
      : (
        <div className="w-full flex justify-center items-center text-3xl text-center">
          <Image width={100} height={100} src="/icons/empty-cart.svg" alt="Empty cart"/>
          <span>{TRANSLATES[LOCALE].emptyCart}</span>
        </div>
      );
}