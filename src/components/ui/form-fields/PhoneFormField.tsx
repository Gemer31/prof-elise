'use client';

import { convertToClass } from '@/utils/convert-to-class.util';
import { useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { InputMask } from '@react-input/mask';

interface IFormField {
  required?: boolean;
  label: string;
  type: string;
  name: string;
  error: string;
  register: unknown;
}

export function PhoneFormField({label, name, register, type, error, required}: IFormField) {
  const inputClass: string = useMemo(() => convertToClass([
    'border-2',
    'rounded-md',
    'mt-1',
    'w-full',
    'px-2.5',
    'py-1'
  ]), []);

  return (
    <label className="w-full pb-4 relative">
      <span className={`mr-2 ${required ? 'field-label' : ''}`}>{label}</span>
      <InputMask
        // @ts-ignore
        placeholder="+375 (XX) XXX-XX-XX"
        mask="+375 (__) ___-__-__"
        replacement={{_: /\d/}}
        className={inputClass}
        type={type}
        {...(register as UseFormRegister<Record<string, unknown>>)(name)}
      />
      {
        error
          ? <div className="absolute text-red-500 text-xs bottom-0">{TRANSLATES[LOCALE][error]}</div>
          : <></>
      }
    </label>
  );
}