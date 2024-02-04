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

interface ICartTableProps {
  firestoreConfigData: IConfig;
}

export function CartTable({firestoreConfigData}: ICartTableProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.dataReducer.cart);

  const updateProductsCount = (productData: ICartProductData, amount: number) => {
    dispatch(addProductToCart({
      ...productData,
      amount,
      addToExist: false
    }));
  };

  return cart.totalProductsAmount
        ? (
          <div>
            <table className="w-full border-2 border-gray-200">
              <thead>
              <tr>
                <td className="w-2/12 text-center">{TRANSLATES[LOCALE].picture}</td>
                <td className="w-4/12">{TRANSLATES[LOCALE].productName}</td>
                <td className="w-2/12">{TRANSLATES[LOCALE].shortAmountText}</td>
                <td className="w-2/12 text-end">{TRANSLATES[LOCALE].priceForOneProduct}</td>
                <td className="w-2/12 text-end">{TRANSLATES[LOCALE].all}</td>
              </tr>
              </thead>
              <tbody>
              {
                Object.values<ICartProductData>(cart.products)?.map((productData: ICartProductData, index) => {
                  return <tr key={productData.data.id}>
                    <td className="flex justify-center items-center">
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
                        <Counter
                          selectedAmount={productData.amount}
                          counterChangedCallback={(newAmount) => updateProductsCount(productData, newAmount)}
                        />
                        <Button
                          styleClass="w-full text-base uppercase text-amber-50 px-4 py-2 mt-2"
                          type={ButtonType.BUTTON}
                          callback={() => dispatch(removeProductFromCart(productData.data.id))}
                        >{TRANSLATES[LOCALE].delete}</Button>
                      </div>
                    </td>
                    <td className="w-2/12 text-end">{productData.data.price} {firestoreConfigData.currency}</td>
                    <td className="w-2/12 text-end">{productData.data.price * productData.amount} {firestoreConfigData.currency}</td>
                  </tr>;
                })
              }
              </tbody>
            </table>
            <div className="flex justify-between items-center text-2xl mt-4">
              <div className="flex">
                <span className="bold">{TRANSLATES[LOCALE].result}</span>
                :
                <span className="ml-4">{cart.totalProductsPrice} {firestoreConfigData.currency}</span>
              </div>

              <Button
                styleClass="w-full text-base uppercase text-amber-50 px-4 py-2 mt-2 w-fit"
                type={ButtonType.BUTTON}
                callback={() => {}}
              >{TRANSLATES[LOCALE].createOrder}</Button>
            </div>
          </div>
    )
    : <div>{TRANSLATES[LOCALE].emptyCart}</div>
}