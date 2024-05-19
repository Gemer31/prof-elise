'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';

export interface ISearchInputProps {
  onChange: (searchValue: string) => void;
}

export function SearchInput({onChange}: ISearchInputProps) {
  const hostClass: string = useMemo(() => convertToClass([
    'border-2',
    'rounded-md',
    'w-full',
    'px-2.5',
    'py-1'
  ]), []);

  const [value, setValue] = useState<string>();
  let timer = useRef(null);

  const valueChanged = (e: ChangeEvent<HTMLInputElement>, forced?: boolean): void => {
    const newValue = e?.target?.value || '';
    setValue(newValue);
    clearTimeout(timer.current);

    if (forced) {
      onChange(newValue);
    } else {
      timer.current = setTimeout(() => {
        onChange(newValue);
      }, 1000);
    }
  };
  const onSubmit = () => {
    clearTimeout(timer.current);
    onChange(value);
  };

  return <form className="sticky top-0 p-2 bg-pink-500" onSubmit={onSubmit}>
    <div className="relative">
      <button type="button" className="absolute right-4 top-1.5" onClick={() => valueChanged(null, true)}>✖</button>
      <input
        value={value}
        className={hostClass}
        onChange={valueChanged}
      />
    </div>
  </form>;
}