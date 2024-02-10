'use client';

import { convertToClass } from '@/utils/convert-to-class.util';
import { useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormFieldWrapper } from '@/components/form-fields/FormFieldWrapper';

interface ITextareaFormFieldProps {
  required?: boolean;
  rows?: number;
  placeholder: string;
  error: string | undefined;
  label: string;
  name: string;
  register: UseFormRegister<Record<string, unknown>>;
}

export function TextareaFormField({label, name, register, required, error, placeholder, rows}: ITextareaFormFieldProps) {
  const textareaClass: string = useMemo(() => convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'rounded-md',
    'mt-1',
    'field-input',
    'w-full',
    'px-2.5',
    'py-1',
    'resize-none',
    // 'whitespace-pre-wrap',
    // 'break-words'
  ]), []);

  return (
    <FormFieldWrapper label={label} error={error} required={required}>
      <textarea
        rows={rows || 5}
        placeholder={placeholder}
        className={textareaClass}
        {...register(name)}
      />
    </FormFieldWrapper>
  );
}