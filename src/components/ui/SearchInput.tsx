'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';

export interface ISearchInputProps {
  searchButtonVisible?: boolean;
  pattern?: string;
  required?: boolean;

  onChange: (searchValue: string) => void;
  onValueChange?: (searchValue: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmit?: (searchValue: string) => void;
}

export function SearchInput({onChange, onValueChange, onSubmit, onBlur, onFocus, required, pattern, searchButtonVisible}: ISearchInputProps) {
  const hostClass: string = useMemo(() => convertToClass([
    searchButtonVisible ? 'border-l-2 border border-t-2 border-b-2' : 'border-2',
    searchButtonVisible ? 'rounded-l-md' : 'rounded-md',
    'w-full',
    'px-2.5',
    'py-1'
  ]), []);
  const clearButtonClass: string = useMemo(() => convertToClass([
    searchButtonVisible ? 'right-12' : 'right-4',
    'absolute',
    'top-1.5',
    'hover:scale-105',
    'duration-200'
  ]), []);

  const [value, setValue] = useState('');
  let timer = useRef(null);

  const valueChanged = (e: ChangeEvent<HTMLInputElement>, forced?: boolean): void => {
    const newValue = e?.target?.value !== undefined
      ? e.target.value
      : value;

    setValue(newValue);
    onValueChange?.(newValue);
    clearTimeout(timer.current);

    if (forced) {
      onChange(newValue);
    } else {
      timer.current = setTimeout(() => {
        onChange(newValue);
      }, 1000);
    }
  };
  const onSubmitClick = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    clearTimeout(timer.current);
    if (onSubmit) {
      onSubmit(value);
    } else {
      onChange(value);
    }
  };

  return <form
    className="relative flex duration-200"
    onSubmit={onSubmitClick}
    onBlur={() => onBlur?.()}
    onFocus={() => onFocus?.()}
  >
    {
      value?.length
        ? <button type="button" className={clearButtonClass} onClick={() => valueChanged(null, true)}>✖</button>
        : <></>
    }
    <input
      required
      placeholder={TRANSLATES[LOCALE].search}
      value={value}
      pattern={pattern}
      className={hostClass}
      onChange={valueChanged}
    />
    {
      searchButtonVisible
        ? <button type="submit" className="bg-pink-500 rounded-r-md p-2" onClick={() => valueChanged(null, true)}>
          <Image className="hover:scale-105 duration-200" width={25} height={25} src="/icons/magnifer.svg" alt="Search"/>
        </button>
        : <></>
    }
  </form>;
}