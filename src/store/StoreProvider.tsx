'use client'

import { AppStore, makeStore } from '@/store/store';
import { ICommonProps } from '@/app/models';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export default function StoreProvider({ children }: ICommonProps) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}