'use client';

import { CartTable } from '@/components/CartTable';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig } from '@/app/models';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormField } from '@/components/form-fields/FormField';
import { PhoneFormField } from '@/components/form-fields/PhoneFormField';

const validationSchema = yup.object().shape({
  name: yup.string().required('fieldRequired').matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required('fieldRequired'),
  email: yup.string().email('fieldInvalid').required('fieldRequired'),
  address: yup.string().required('fieldRequired'),
});

interface ICheckoutFormProps {
  firestoreConfigData: IConfig;
}

export function CheckoutForm({firestoreConfigData}: ICheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = () => {

  }

  return (
    <form
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

      <div className="mt-4">
        <CartTable firestoreConfigData={firestoreConfigData}/>
      </div>

      <div className="w-full flex justify-end mt-4">
        <Button
          styleClass="uppercase text-amber-50 px-4 py-2"
          type={ButtonType.SUBMIT}
          loading={loading}
          disabled={loading}
        >{TRANSLATES[LOCALE].confirmOrder}</Button>
      </div>
    </form>
  );
}