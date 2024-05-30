'use client';

import { FirestoreCollections, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IClient, IConfig } from '@/app/models';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { PhoneFormField } from '@/components/ui/form-fields/PhoneFormField';
import { TextareaFormField } from '@/components/ui/form-fields/TextareaFormField';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getOrderMessage } from '@/utils/telegram.util';
import Image from 'next/image';
import Link from 'next/link';
import { updateClient } from '@/store/asyncThunk';
import { getClientId } from '@/utils/cookies.util';
import { getEnrichedCart } from '@/utils/firebase.util';
import { CheckoutTotalBar } from '@/components/view/checkout-form/CheckoutTotalBar';
import { Button } from '@/components/ui/Button';
import { generateOrderNumber } from '@/utils/order-number.util';
import { doc, setDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object().shape({
  name: yup.string().required('fieldRequired').matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required('fieldRequired'),
  email: yup.string().email('fieldInvalid').required('fieldRequired'),
  address: yup.string().required('fieldRequired'),
  comment: yup.string()
});

interface ICheckoutFormProps {
  config: IConfig;
}

export function CheckoutForm({config}: ICheckoutFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const client: IClient = useAppSelector(state => state.dataReducer.client);
  const cartLoading: boolean = useAppSelector(state => state.dataReducer.cartLoading);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<number>();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    if (!cartLoading && !Object.keys(client.cart)?.length) {
      router.push(RouterPath.CART);
    }
  }, [cartLoading]);

  const submitForm = async (formData: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    comment?: string;
  }) => {
    const orderNumber = generateOrderNumber();
    const enrichedCart = await getEnrichedCart(client.cart);

    await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/bot`, {
      method: 'POST',
      body: JSON.stringify({
        message: encodeURI(getOrderMessage({
          ...formData,
          orderNumber,
          cart: enrichedCart,
          config: config
        }))
      })
    });
    setCreatedOrderNumber(orderNumber);
    await setDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, getClientId()), {
      ...client,
      cart: {}
    });
    dispatch(updateClient({
      clientId: getClientId(),
      data: {
        ...client,
        cart: {}
      }
    }));

    setLoading(false);
    // try {
    //
    // } catch (e) {
    //   setCreatedOrderNumber(null);
    //   dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    // } finally {
    // }
  };

  return <>
    {
      createdOrderNumber
        ? <section className="h-full flex flex-col justify-center items-center py-10">
          <div className="flex items-center">
            <Image width={50} height={50} src="/icons/tick.svg" alt="Success"/>
            <span className="ml-2 text-4xl font-bold">{TRANSLATES[LOCALE].order} №{createdOrderNumber}</span>
          </div>
          <span className="text-2xl my-4 text-center">{TRANSLATES[LOCALE].orderCreatedSuccessfully}</span>
          <Link
            className="text-pink-500 hover:text-pink-400 text-xl duration-500 transition-colors"
            href={RouterPath.CATEGORIES}
          >{TRANSLATES[LOCALE].returnToCatalog}</Link>
        </section>
        : <>
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
                required={true}
                placeholder={TRANSLATES[LOCALE].enterName}
                label={TRANSLATES[LOCALE].name}
                name="name"
                type="text"
                error={errors.name?.message}
                register={register}
              />
              <InputFormField
                required={true}
                placeholder="E-mail"
                label="E-mail"
                name="email"
                type="text"
                error={errors.email?.message}
                register={register}
              />
              <PhoneFormField
                required={true}
                label={TRANSLATES[LOCALE].phone}
                type="text"
                name="phone"
                error={errors.phone?.message}
                register={register}
              />
              <InputFormField
                required={true}
                placeholder={TRANSLATES[LOCALE].enterAddress}
                label={TRANSLATES[LOCALE].address}
                name="address"
                type="text"
                error={errors.address?.message}
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
    }
  </>;
}