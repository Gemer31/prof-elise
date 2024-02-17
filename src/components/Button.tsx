'use client';

import { ICommonProps } from '@/app/models';
import { ButtonType } from '@/app/enums';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Loader } from '@/components/Loader';
import { MouseEvent, useMemo } from 'react';

export interface IButtonProps extends ICommonProps {
  type: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  styleClass?: string;
  callback?: (event: MouseEvent) => void;
}

export function Button({children, callback, type, disabled, loading, styleClass}: IButtonProps) {
  const buttonClass: string = useMemo(() => convertToClass([
    'flex',
    'relative',
    'justify-center',
    'items-center',
    'bg-pink-500',
    'hover:bg-pink-400',
    'active:bg-pink-600',
    'rounded-md',
    'h-fit',
    'duration-200',
    'active:scale-100',
    'hover:scale-105',
    disabled ? 'pointer-events-none opacity-75' : ''
  ]), []);

  return (
    <button
      type={type || ButtonType.BUTTON}
      className={buttonClass + ' ' + styleClass}
      onClick={(event: MouseEvent) => callback?.(event)}
    >
      <span className={loading ? 'invisible' : ''}>{children}</span>
      <div className={`${loading ? 'w-full h-full absolute top-0' : 'important-hidden'} ${styleClass}`}>
        <Loader/>
      </div>
    </button>
  );
}