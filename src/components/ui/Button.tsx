'use client';

import { ICommonProps } from '@/app/models';
import { ButtonTypes, ColorOptions } from '@/app/enums';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Loader } from '@/components/ui/Loader';
import { MouseEvent, useMemo } from 'react';
import { COLOR_OPTION_VALUES } from '@/app/constants';
import Link from 'next/link';

export interface IButtonProps extends ICommonProps {
  color?: ColorOptions;
  type?: ButtonTypes;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  styleClass?: string;
  callback?: (event: MouseEvent) => void;
}

export function Button({children, href, callback, type, disabled, loading, color, styleClass}: IButtonProps) {
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
  ]), [disabled]);

  return href
    ? <Link
      className={buttonClass + ' ' + COLOR_OPTION_VALUES.get(color || ColorOptions.PINK) + ' ' + styleClass}
      onClick={(event: MouseEvent) => callback?.(event)}
      href={href}
    >
      <div className={loading ? 'invisible' : ''}>{children}</div>
      <div className={`${loading ? 'w-full h-full text-center absolute top-0' : 'important-hidden'} ${styleClass}`}>
        <Loader className={'h-full'}/>
      </div>
    </Link>
    : <button
      type={type || ButtonTypes.BUTTON}
      className={buttonClass + ' ' + COLOR_OPTION_VALUES.get(color || ColorOptions.PINK) + ' ' + styleClass}
      onClick={(event: MouseEvent) => callback?.(event)}
    >
      <div className={loading ? 'invisible' : ''}>{children}</div>
      <div className={`${loading ? 'w-full h-full absolute top-0' : 'important-hidden'} ${styleClass}`}>
        <Loader className={'h-full'}/>
      </div>
    </button>;

}