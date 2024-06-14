'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { initStore } from '@/store/asyncThunk';
import { useAppDispatch } from '@/store/store';

export function GlobalComponent() {
  const dispatch = useAppDispatch();
  const session = useSession();

  useEffect(() => {
    dispatch(initStore());
  }, []);

  useEffect(() => {
    if (session?.data?.user) {

    }
  }, [session]);

  return '';
}
