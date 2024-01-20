'use client'

import { AppStore, makeStore } from '@/store/store';
import { CommonProps } from '@/app/models';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export default function StoreProvider({ children }: CommonProps) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}