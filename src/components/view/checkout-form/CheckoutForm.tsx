'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import { doc, DocumentReference, setDoc } from '@firebase/firestore';
import { useRouter } from 'next/navigation';
import { uuidv4 } from '@firebase/util';
import { Session } from 'next-auth';
import currency from 'currency.js';
import { FirestoreCollections, OrderStatuses, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig, IOrderProduct, IUserSerialized } from '@/app/models';
import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { PhoneFormField } from '@/components/ui/form-fields/PhoneFormField';
import { TextareaFormField } from '@/components/ui/form-fields/TextareaFormField';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getOrderMessage } from '@/utils/telegram.util';
import { updateCart } from '@/store/asyncThunk';
import { getClientId } from '@/utils/cookies.util';
import { getEnrichedCart } from '@/utils/firebase.util';
import { CheckoutTotalBar } from '@/components/view/checkout-form/CheckoutTotalBar';
import { Button } from '@/components/ui/Button';
import { generateRandomNumber } from '@/utils/order-number.util';
import { db } from '@/app/lib/firebase-config';
import { YupUtil } from '@/utils/yup.util';
import { revalidateOrders } from '@/app/actions';

interface ICheckoutFormProps {
  user: IUserSerialized;
  session: Session;
  config: IConfig;
}

export function CheckoutForm(
  {
    config,
    session,
    user,
  }: ICheckoutFormProps,
) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.dataReducer.cart);
  const cartLoading: boolean = useAppSelector((state) => state.dataReducer.cartLoading);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<number>();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
      isValid,
    },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(YupUtil.CheckoutFormSchema),
  });

  useEffect(() => {
    if (!cartLoading && !Object.keys(cart)?.length) {
      router.push(RouterPath.CART);
    }
  }, [cartLoading]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('deliveryAddress', user.deliveryAddress || '');
    }
  }, [user]);

  const submitForm = async (formData: {
    name?: string;
    phone?: string;
    email?: string;
    deliveryAddress?: string;
    comment?: string;
  }) => {
    const orderId: string = uuidv4();
    const orderNumber = generateRandomNumber(6);
    const enrichedCart = await getEnrichedCart(cart);

    if (session?.user) {
      let totalPrice: string = '0';
      const products: IOrderProduct[] = [];

      Object.values(enrichedCart)
        .forEach((item) => {
          const totalProduct = currency(item.productRef.price)
            .multiply(item.count);
          totalPrice = currency(totalPrice)
            .add(totalProduct)
            .toString();
          products.push({
            id: item.productRef.id,
            title: item.productRef.title,
            price: `${currency(item.productRef.price)
              .toString()} ${config.currency}`,
            count: item.count,
            categoryId: item.productRef.categoryRef,
          });
        });
      await setDoc(doc(db, FirestoreCollections.ORDERS, orderId), {
        id: orderId,
        userRef: doc(db, FirestoreCollections.USERS, user.email),
        status: OrderStatuses.CREATED,
        number: orderNumber,
        createDate: +new Date(),
        comment: formData.comment,
        totalPrice: `${totalPrice} ${config.currency}`,
        products,
      });
      const newUserOrders: Record<string, DocumentReference> = {};
      Object.values(user.orders)
        .forEach((item) => {
          newUserOrders[item] = doc(db, FirestoreCollections.ORDERS, item);
        });

      await setDoc(doc(db, FirestoreCollections.USERS, session.user.email), {
        ...user,
        orders: {
          ...newUserOrders,
          [orderId]: doc(db, FirestoreCollections.ORDERS, orderId),
        },
      });
    }

    await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/bot`, {
      method: 'POST',
      body: JSON.stringify({
        message: encodeURI(getOrderMessage({
          ...formData,
          orderNumber,
          cart: enrichedCart,
          config,
        })),
      }),
    });

    await revalidateOrders();
    setCreatedOrderNumber(orderNumber);
    dispatch(updateCart({
      clientId: getClientId(),
      data: {},
    }));

    setLoading(false);
    // TODO: error telegram message on prod
    // try {
    //
    // } catch (e) {
    //   setCreatedOrderNumber(null);
    //   dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    // } finally {
    // }
  };

  return (
    <>
      {
      createdOrderNumber
        ? (
          <section className="h-full flex flex-col justify-center items-center py-10">
            <div className="flex items-center">
              <Image width={50} height={50} src="/icons/tick.svg" alt="Success"/>
              <span className="ml-2 text-4xl font-bold">{TRANSLATES[LOCALE].order} №{createdOrderNumber}</span>
            </div>
            <span className="text-2xl my-4 text-center">{TRANSLATES[LOCALE].orderCreatedSuccessfully}</span>
            <Link
              className="text-pink-500 hover:text-pink-400 text-xl duration-500 transition-colors"
              href={RouterPath.CATEGORIES}
            >{TRANSLATES[LOCALE].returnToCatalog}
            </Link>
          </section>
        )
        : (
          <>
            <div className="w-full flex justify-between items-center mb-2">
              <h1 className="text-center text-2xl uppercase mb-4">{TRANSLATES[LOCALE].orderCreation}</h1>
              <Button styleClass="flex px-2 py-1 text-sm" href={RouterPath.CART}>
                {TRANSLATES[LOCALE].returnToCart}
              </Button>
            </div>
            <form
              className="w-full flex gap-x-4"
              onSubmit={handleSubmit(submitForm)}
            >
              <div className="w-full flex flex-col gap-y-0.5">
                <InputFormField
                  required
                  placeholder={TRANSLATES[LOCALE].enterFio}
                  label={TRANSLATES[LOCALE].fio}
                  name="name"
                  type="text"
                  error={errors.name?.message}
                  register={register}
                />
                <InputFormField
                  required
                  placeholder="E-mail"
                  label="E-mail"
                  name="email"
                  type="text"
                  error={errors.email?.message}
                  register={register}
                />
                <PhoneFormField
                  required
                  label={TRANSLATES[LOCALE].phone}
                  type="text"
                  name="phone"
                  error={errors.phone?.message}
                  register={register}
                />
                <InputFormField
                  required
                  placeholder={TRANSLATES[LOCALE].enterAddress}
                  label={TRANSLATES[LOCALE].address}
                  name="deliveryAddress"
                  type="text"
                  error={errors.deliveryAddress?.message}
                  register={register}
                />
                <TextareaFormField
                  placeholder={TRANSLATES[LOCALE].comment}
                  label={TRANSLATES[LOCALE].comment}
                  name="comment"
                  error={errors.comment?.message}
                  register={register}
                />
              </div>
              <CheckoutTotalBar
                isLoading={loading}
                onSubmit={() => {
                  if (isValid) {
                    setLoading(true);
                  }
                }}
                config={config}
              />
            </form>
          </>
        )
    }
    </>
  );
}
