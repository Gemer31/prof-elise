'use client';

import { convertToClass } from '@/utils/convert-to-class.util';
import { useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface IFormFieldProps {
  required?: boolean;
  label: string;
  type: string;
  name: string;
  error: string | undefined;
  register: UseFormRegister<Record<string, unknown>>;
}

export function FormField({label, name, register, type, error, required}: IFormFieldProps) {
  const inputClass: string = useMemo(() => convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'rounded-md',
    'mt-1',
    'field-input',
    'w-full',
    'px-2.5',
    'py-1'
  ]), []);

  return (
    <label className="w-full pb-4 relative">
      <span className={`mr-2 ${required ? 'field-label' : ''}`}>{label}</span>
      <input
        className={inputClass}
        type={type}
        {...register(name)}
      />
      {
        error
          ? <div className="absolute text-red-500 text-xs bottom-0">{TRANSLATES[LOCALE][error]}</div>
          : <></>
      }
    </label>
  );
}