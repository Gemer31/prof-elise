'use client';

import { convertToClass } from '@/utils/convert-to-class.util';
import { useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormFieldWrapper } from '@/components/form-fields/FormFieldWrapper';

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
    <FormFieldWrapper label={label} error={error} required={required}>
      <input
        className={inputClass}
        type={type}
        {...register(name)}
      />
    </FormFieldWrapper>
  );
}