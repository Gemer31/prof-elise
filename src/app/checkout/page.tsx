'use client'

import { ContentContainer } from '@/components/ContentContainer';
import * as yup from 'yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { InputMask } from '@react-input/mask';
import { convertToClass } from '@/utils/convert-to-class.util';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CartTable } from '@/components/CartTable';

const validationSchema = yup.object().shape({
  name: yup.string().required().matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required(),
  email: yup.string().email(),
  address: yup.string().required(),
});

export default function CheckoutPage() {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  return (
    <main>
      <ContentContainer>
        <CartTable firestoreConfigData={}/>
      </ContentContainer>
    </main>
  )
}