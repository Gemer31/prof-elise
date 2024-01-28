'use client';

import { CommonProps } from '@/app/models';
import { ButtonType } from '@/app/enums';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Loader } from '@/components/loader/loader';

export interface ButtonProps extends CommonProps {
  type: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  styleClass?: string;
  callback?: () => void;
}

export function Button({children, callback, type, disabled, loading, styleClass}: ButtonProps) {
  const buttonClass: string = convertToClass([
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
  ]);

  return (
    <button
      type={type || ButtonType.BUTTON}
      className={buttonClass + ' ' + styleClass}
      onClick={() => callback?.()}
    >
      <span className={loading ? 'invisible' : ''}>{children}</span>
      <div className={styleClass + (loading ? ' w-full h-full absolute top-0' : ' hidden')}>
        <Loader/>
      </div>
    </button>
  );
}