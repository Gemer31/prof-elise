'use client';

import { Provider } from 'react-redux';
import { useRef } from 'react';
import { AppStore, makeStore } from '@/store/store';
import { ICommonProps } from '@/app/models';

export default function StoreProvider({ children }: ICommonProps) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}