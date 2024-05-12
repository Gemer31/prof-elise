'use client';

import { CartTable } from '@/components/CartTable';
import { Button } from '@/components/Button';
import { ButtonType, FirestoreCollections, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig } from '@/app/models';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputFormField } from '@/components/form-fields/InputFormField';
import { PhoneFormField } from '@/components/form-fields/PhoneFormField';
import { TextareaFormField } from '@/components/form-fields/TextareaFormField';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { FormFieldWrapper } from '@/components/form-fields/FormFieldWrapper';
import { getOrderMessage } from '@/utils/telegram.util';
import { doc, setDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import Image from 'next/image';
import Link from 'next/link';
import { updateClient } from '@/store/asyncThunk';
import { CLIENT_ID } from '@/app/constants';
import { IClient } from '@/store/dataSlice';

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
  const clientId = useMemo(() => localStorage.getItem(CLIENT_ID), []);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const client: IClient = useAppSelector(state => state.dataReducer.client);
  const [loading, setLoading] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<number>();
  const {
    register,
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
    await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/bot`, {
      method: 'POST',
      body: JSON.stringify({
        message: encodeURI(getOrderMessage({
          ...formData,
          orderNumber: config.nextOrderNumber,
          cart: cart,
          config: config,
        }))
      })
    });
    setCreatedOrderNumber(config.nextOrderNumber);
    await setDoc(doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirestoreCollections.CONFIG), {
      contactPhone: config.contactPhone,
      workingHours: config.workingHours,
      currency: config.currency,
      shopDescription: config.shopDescription,
      deliveryDescription: config.deliveryDescription,
      nextOrderNumber: config.nextOrderNumber + 1
    });
    dispatch(updateClient({
      clientId,
      data: {
        ...client,
        cart: {}
      }
    }));
    setLoading(false);
  };

  return createdOrderNumber
    ? <div className="h-full flex flex-col justify-center items-center">
      <div className="flex items-center">
        <Image width={50} height={50} src="/icons/tick.svg" alt="Success"/>
        <span className="ml-2 text-4xl font-bold">{TRANSLATES[LOCALE].order} №{createdOrderNumber}</span>
      </div>
      <span className="text-2xl my-4 text-center">{TRANSLATES[LOCALE].orderCreatedSuccessfully}</span>
      <Link
        className="text-pink-500 hover:text-pink-400 text-xl duration-500 transition-colors"
        href={RouterPath.HOME}
      >{TRANSLATES[LOCALE].returnToCatalog}</Link>
    </div>
    : <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >
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
      <FormFieldWrapper label={TRANSLATES[LOCALE].order}>
        <CartTable config={config}/>
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