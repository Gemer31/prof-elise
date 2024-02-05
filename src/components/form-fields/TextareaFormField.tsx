'use client';

import { convertToClass } from '@/utils/convert-to-class.util';
import { useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface ITextareaFormFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<Record<string, unknown>>;
}

export function TextareaFormField({label, name, register}: ITextareaFormFieldProps) {
  const textareaClass: string = useMemo(() => convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'rounded-md',
    'mt-1',
    'field-input',
    'w-full',
    'px-2.5',
    'py-1',
    'resize-none'
  ]), []);

  return (
    <label className="w-full pb-4 relative">
      <span className="mr-2">{label}</span>
      <textarea
        className={textareaClass}
        {...register(name)}
      />
    </label>
  );
}