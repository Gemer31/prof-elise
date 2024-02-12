'use client';

import { convertToClass } from '@/utils/convert-to-class.util';
import { useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormFieldWrapper } from '@/components/form-fields/FormFieldWrapper';

interface IInputFormFieldProps {
  required?: boolean;
  placeholder: string;
  label: string;
  type: string;
  name: string;
  error: string | undefined;
  register: unknown;
}

export function InputFormField({label, name, register, type, error, required, placeholder}: IInputFormFieldProps) {
  const inputClass: string = useMemo(() => convertToClass([
    'border-2',
    'rounded-md',
    'mt-1',
    'w-full',
    'px-2.5',
    'py-1'
  ]), []);

  return (
    <FormFieldWrapper label={label} error={error} required={required}>
      <input
        className={inputClass}
        placeholder={placeholder}
        type={type}
        {...(register as UseFormRegister<Record<string, unknown>>)(name)}
      />
    </FormFieldWrapper>
  );
}