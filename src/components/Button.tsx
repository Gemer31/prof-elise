'use client'

import { CommonProps } from '@/app/models';
import { Simulate } from 'react-dom/test-utils';
import { ButtonType } from '@/app/enums';
import { convertToClass } from '@/utils/convert-to-class.util';

export interface ButtonProps extends CommonProps {
  type: ButtonType;
  disabled?: boolean;
  styleClass?: string;
  callback?: () => void;
}

export function Button({ children, callback, type, disabled, styleClass }: ButtonProps) {
  const buttonClass: string = convertToClass([
    'flex',
    'justify-center',
    'items-center',
    'bg-pink-500',
    'hover:bg-pink-400',
    'active:bg-pink-600',
    'rounded-md',
    'h-fit',
    'duration-500',
    disabled ? 'pointer-events-none' : '',
  ]);

  return (
    <button
      type={type || ButtonType.BUTTON}
      className={buttonClass + styleClass}
      onClick={() => callback?.()}
    >{children}</button>
  )
}