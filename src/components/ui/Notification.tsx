'use client';

import { convertToClass } from '@/utils/convert-to-class.util';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { FADE_IN_RIGHT_CLASS, FADE_OUT_RIGHT_CLASS } from '@/app/constants';
import { setNotificationMessage } from '@/store/dataSlice';

export function Notification() {
  const dispatch = useAppDispatch();
  const message = useAppSelector(
    (state) => state.dataReducer.notificationMessage
  );
  const [animationClass, setAnimationClass] = useState<string>();

  useEffect(() => {
    if (message) {
      setAnimationClass(FADE_IN_RIGHT_CLASS);
      setTimeout(() => {
        setAnimationClass(FADE_OUT_RIGHT_CLASS);
      }, 4000);
      setTimeout(() => {
        dispatch(setNotificationMessage(null));
      }, 4700);
    }
  }, [message]);

  const styleClasses: string = useMemo(
    () =>
      convertToClass([
        'fixed',
        'px-3',
        'py-1',
        'border-2',
        'border-amber-50',
        'rounded-lg',
        'top-3',
        'right-4',
        'bg-pink-500',
        'text-amber-50',
        'z-20',
      ]),
    []
  );

  return (
    <div
      className={
        styleClasses + (animationClass ? ` ${animationClass}` : ' invisible')
      }
    >
      {message}
    </div>
  );
}
