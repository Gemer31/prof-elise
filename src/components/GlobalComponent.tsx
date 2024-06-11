'use client';

import { useEffect } from 'react';
import { initStore } from '@/store/asyncThunk';
import { useAppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

  return <></>;
}