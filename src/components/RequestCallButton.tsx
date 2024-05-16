'use client'

import { Button } from '@/components/Button';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useAppDispatch } from '@/store/store';
import { ButtonTypes } from '@/app/enums';

export function RequestCallButton() {
  const dispatch = useAppDispatch();

  return <Button
    styleClass="uppercase text-amber-50 px-4 py-2"
    type={ButtonTypes.BUTTON}
    callback={() => dispatch(setRequestCallPopupVisible(true))}
  >{TRANSLATES[LOCALE].requestCall}</Button>
}