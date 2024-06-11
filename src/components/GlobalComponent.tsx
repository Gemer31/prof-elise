'use client';

import { useEffect } from 'react';
import { initStore } from '@/store/asyncThunk';
import { useAppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';

export function GlobalComponent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(initStore());
  }, []);

  return <></>;
}