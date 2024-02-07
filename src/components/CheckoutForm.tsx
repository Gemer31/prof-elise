'use client';

import { CartTable } from '@/components/CartTable';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig } from '@/app/models';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormField } from '@/components/form-fields/FormField';
import { PhoneFormField } from '@/components/form-fields/PhoneFormField';
import { TextareaFormField } from '@/components/form-fields/TextareaFormField';
import path from 'path';
import { setCartData, setNotificationMessage, setRequestCallPopupVisible } from '@/store/dataSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { FormFieldWrapper } from '@/components/form-fields/FormFieldWrapper';
import { getOrderMessage } from '@/utils/telegram.util';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import Image from 'next/image';

const validationSchema = yup.object().shape({
  name: yup.string().required('fieldRequired').matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required('fieldRequired'),
  email: yup.string().email('fieldInvalid').required('fieldRequired'),
  address: yup.string().required('fieldRequired'),
  comment: yup.string()
});

interface ICheckoutFormProps {
  firestoreConfigData: IConfig;
}

export function CheckoutForm({firestoreConfigData}: ICheckoutFormProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.dataReducer.cart);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<number | undefined>();
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = async (formData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    comment?: string;
  }) => {
    setLoading(true);

    await fetch(path.join(process.cwd(), 'api', 'bot'), {
      method: 'POST',
      body: JSON.stringify({
        message: encodeURI(getOrderMessage({
          ...formData,
          orderNumber: firestoreConfigData.nextOrderNumber,
          cart: cart,
          config: firestoreConfigData,
        }))
      })
    });
    setCreatedOrderNumber(firestoreConfigData.nextOrderNumber);
    await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.CONFIG), {
      contactPhone: firestoreConfigData.contactPhone,
      workingHours: firestoreConfigData.workingHours,
      currency: firestoreConfigData.currency,
      shopDescription: firestoreConfigData.shopDescription,
      nextOrderNumber: firestoreConfigData.nextOrderNumber + 1
    });
    dispatch(setCartData({
      totalProductsPrice: 0,
      totalProductsAmount: 0,
      products: {},
    }));

    setLoading(false);
  };

  return createdOrderNumber
    ? <div className="flex flex-col justify-center items-center">
      <div className="flex items-center">
        <Image width={50} height={50} src="/icons/tick.svg" alt="Success"/>
        <span className="ml-2 text-4xl font-bold">{TRANSLATES[LOCALE].order} №{createdOrderNumber}</span>
      </div>
      <span className="text-xl">{TRANSLATES[LOCALE].orderCreatedSuccessfully}</span>
    </div>
    : <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >
      <FormField
        required={true}
        label={TRANSLATES[LOCALE].name}
        name="name"
        type="text"
        error={errors.name?.message}
        register={register}
      />
      <FormField
        required={true}
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
      <FormField
        required={true}
        label={TRANSLATES[LOCALE].address}
        name="address"
        type="text"
        error={errors.address?.message}
        register={register}
      />
      <TextareaFormField
        label={TRANSLATES[LOCALE].comment}
        name="comment"
        register={register}
      />
      <FormFieldWrapper label={TRANSLATES[LOCALE].order}>
        <CartTable firestoreConfigData={firestoreConfigData}/>
      </FormFieldWrapper>
      <div className="w-full flex justify-end mt-4">
        <Button
          styleClass="uppercase text-amber-50 px-4 py-2"
          type={ButtonType.SUBMIT}
          loading={loading}
          disabled={loading}
        >{TRANSLATES[LOCALE].confirmOrder}</Button>
      </div>
    </form>;
}