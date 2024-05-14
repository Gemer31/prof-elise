'use client';

import { ICommonProps } from '@/app/models';
import { ButtonColors, ButtonTypes } from '@/app/enums';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Loader } from '@/components/Loader';
import { MouseEvent, useMemo } from 'react';

export interface IButtonProps extends ICommonProps {
  color?: ButtonColors;
  type: ButtonTypes;
  disabled?: boolean;
  loading?: boolean;
  styleClass?: string;
  callback?: (event: MouseEvent) => void;
}

export function Button({children, callback, type, disabled, loading, color, styleClass}: IButtonProps) {
  const buttonClass: string = useMemo(() => convertToClass([
    'flex',
    'relative',
    'justify-center',
    'items-center',
    'rounded-md',
    'h-fit',
    'duration-200',
    'active:scale-100',
    'hover:scale-105',
    disabled ? 'pointer-events-none opacity-75' : ''
  ]), []);

  return (
    <button
      type={type || ButtonTypes.BUTTON}
      className={buttonClass + ' ' + (color || ButtonColors.PINK) + ' ' + styleClass}
      onClick={(event: MouseEvent) => callback?.(event)}
    >
      <div className={loading ? 'invisible' : ''}>{children}</div>
      <div className={`${loading ? 'w-full h-full absolute top-0' : 'important-hidden'} ${styleClass}`}>
        <Loader className={'h-full'}/>
      </div>
    </button>
  );
}