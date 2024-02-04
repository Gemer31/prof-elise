'use client'

import { convertToClass } from '@/utils/convert-to-class.util';
import { useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { InputMask } from '@react-input/mask';

interface IFormField {
  label: string;
  type: string
  name: string;
  register: UseFormRegister<Record<string, unknown>>;
}

export function PhoneFormField({label, name, register, type}: IFormField) {
  const inputClass: string = useMemo(() => convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]), []);

  return (
    <label className="w-full mb-2 relative">
      <span className="mr-2">{label}</span>
      <InputMask
        placeholder="+375 (99) 999-99-99"
        mask="+375 (__) ___-__-__"
        replacement={{_: /\d/}}
        className={inputClass}
        type={type}
        {...register(name)}
      />
    </label>
  )
}