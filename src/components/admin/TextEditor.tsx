'use client';

import { useEffect, useMemo, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface ITextEditorFormFieldProps {
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}

export function TextEditor({
  value,
  placeholder,
  onChange,
}: ITextEditorFormFieldProps) {
  const editorClass: string = useMemo(
    () =>
      convertToClass([
        'field-editor',
        'border-2',
        'bg-white',
        'rounded-md',
        'mt-1',
        'w-full',
      ]),
    []
  );

  const [innerValue, setInnerValue] = useState<string>('');

  useEffect(() => {
    setInnerValue(value || '');
  }, [value]);

  const valueChange = (newValue: string) => {
    setInnerValue(newValue);
    onChange(newValue);
  };

  return (
    <ReactQuill
      className={editorClass}
      placeholder={placeholder}
      theme="snow"
      value={innerValue}
      onChange={valueChange}
    />
  );
}
