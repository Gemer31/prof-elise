'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonType, FirestoreCollections, RouterPath } from '@/app/enums';
import { Counter } from '@/components/Counter';
import { Button } from '@/components/Button';
import { ICartProductModel, IClient } from '@/store/dataSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/Loader';
import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { CLIENT_ID } from '@/app/constants';
import { IConfig, IProduct } from '@/app/models';
import { updateClient } from '@/store/asyncThunk';

interface ICartTableProps {
  title?: string;
  editable?: boolean;
  config: IConfig;
}

export function CartTable({config, editable, title}: ICartTableProps) {
  const router = useRouter();
  const clientId = useMemo(() => localStorage.getItem(CLIENT_ID), []);
  const [data, setData] = useState<{ count: number, product: IProduct }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const cart = useAppSelector(state => state.dataReducer.client['cart']);
  const cartTotal = useAppSelector(state => state.dataReducer.cartTotal);
  const cartLoading = useAppSelector(state => state.dataReducer.cartLoading);
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);

  useEffect(() => {
    const productsIds = cart && Object.keys(cart);

    if (productsIds?.length) {
      getDocs(query(collection(db, FirestoreCollections.PRODUCTS), where('id', 'in', productsIds)))
        .then((cartProducts) => {
          const products = [];
          let total = 0;

          cartProducts.docs.map((p) => {
            const productData = p.data() as IProduct;
            total += +productData.price * cart[p.id]?.['count'];
            products.push({
              product: productData,
              count: cart[p.id]?.['count'],
            });
          });

          setTotalPrice(total);
          setData(products);
          setDataLoading(false);
        });
    }
  }, [cart]);

  const updateProductsCount = (product: IProduct, count: number) => {
    const newCart: Record<string, ICartProductModel> = {};
    Object.keys(client.cart).forEach((item) => {
      newCart[item] = {...client.cart[item]};
    });

    newCart[product.id] = {
      count,
      productRef: doc(db, FirestoreCollections.PRODUCTS, product.id)
    };

    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        cart: newCart
      }
    }));
  };

  const deleteProduct = (productId: string) => {
    const newCart: Record<string, ICartProductModel> = {};
    Object.keys(client.cart).forEach((item) => {
      newCart[item] = {...client.cart[item]};
    });

    delete newCart[productId];

    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        cart: newCart
      }
    }));
  };

  return cartLoading || dataLoading
    ? <div className="w-full flex justify-center mt-4 overflow-hidden">
      <Loader styleClass="min-h-[250px] border-pink-500"
      /></div>
    : cartTotal
      ? (
        <div>
          <h2 className="my-4 text-center sm:text-start text-2xl">{title}</h2>
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
              data.map((item, index) => {
                return <tr key={item.product.id}>
                  <td className="justify-center items-center hidden sm:flex">
                    <Image
                      width={100}
                      height={100}
                      src={item.product.imageUrls?.[0] || ''}
                      alt={item.product.title}
                    />
                  </td>
                  <td>
                    <Link
                      className="w-4/12"
                      href={`${RouterPath.CATEGORIES}/${item.product?.categoryId}${RouterPath.PRODUCTS}/${item.product?.id}`}
                    >{item.product.title}</Link>
                  </td>
                  <td className="">
                    <div className="flex flex-col items-center justify-center">
                      {
                        editable
                          ? <>
                            <Counter
                              selectedAmount={item.count}
                              counterChangedCallback={(newAmount) => updateProductsCount(item.product, newAmount)}
                            />
                            <Button
                              styleClass="w-full text-base uppercase text-amber-50 px-4 py-2 mt-2"
                              type={ButtonType.BUTTON}
                              callback={() => deleteProduct(item.product.id)}
                            >{TRANSLATES[LOCALE].delete}</Button>
                          </>
                          : <>{item.count}</>
                      }
                    </div>
                  </td>
                  <td className="w-2/12 text-end">{item.product.price} {config.currency}</td>
                  <td
                    className="w-2/12 text-end hidden sm:table-cell">{(parseFloat(item.product.price) * item.count).toFixed(2)} {config.currency}</td>
                </tr>;
              })
            }
            </tbody>
          </table>
          <div className={`flex items-center text-2xl mt-4 ${editable ? 'justify-between' : 'justify-end'}`}>
            <div className="flex">
              <span className="bold">{TRANSLATES[LOCALE].result}</span>
              :
              <span className="ml-4">{totalPrice} {config.currency}</span>
            </div>
            {
              editable
                ? <Button
                  styleClass="w-fit text-base uppercase text-amber-50 px-4 py-2 w-fit"
                  type={ButtonType.BUTTON}
                  loading={createOrderLoading}
                  callback={() => {
                    setCreateOrderLoading(true);
                    router.push(RouterPath.CHECKOUT);
                  }}
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