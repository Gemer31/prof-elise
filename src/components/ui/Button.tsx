'use client';

import { ICommonProps } from '@/app/models';
import { ButtonTypes, ColorOptions } from '@/app/enums';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Loader } from '@/components/ui/Loader';
import { MouseEvent, useMemo, useState } from 'react';
import { COLOR_OPTION_VALUES } from '@/app/constants';
import Link from 'next/link';

export interface IButtonProps extends ICommonProps {
  color?: ColorOptions;
  type?: ButtonTypes;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  setLoadingOnClick?: boolean;
  styleClass?: string;
  callback?: (event: MouseEvent) => void;
}

export function Button(
  {
    children,
    href,
    callback,
    type,
    disabled,
    loading,
    setLoadingOnClick,
    color,
    styleClass
  }: IButtonProps
) {
  const [innerLoading, setInnerLoading] = useState(false);

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
    (disabled || innerLoading) ? 'pointer-events-none opacity-75' : ''
  ]), [disabled, innerLoading]);

  const clicked = (event: MouseEvent) => {
    if (setLoadingOnClick) {
      setInnerLoading(true);
    }
    callback?.(event);
  };

  return href
    ? <Link
      className={buttonClass + ' ' + COLOR_OPTION_VALUES.get(color || ColorOptions.PINK) + ' ' + styleClass}
      onClick={clicked}
      href={href}
    >
      <div className={loading || innerLoading ? 'invisible' : ''}>{children}</div>
      <div
        className={`${loading || innerLoading ? 'w-full h-full flex justify-center text-center absolute top-0' : 'important-hidden'} ${styleClass}`}>
        <Loader className={'h-full ' + (color === ColorOptions.GRAY ? 'border-pink-500' : '')}/>
      </div>
    </Link>
    : <button
      type={type || ButtonTypes.BUTTON}
      className={buttonClass + ' ' + COLOR_OPTION_VALUES.get(color || ColorOptions.PINK) + ' ' + styleClass}
      onClick={clicked}
    >
      <div className={loading || innerLoading ? 'invisible' : ''}>{children}</div>
      <div className={`${loading || innerLoading ? 'w-full h-full absolute top-0' : 'important-hidden'} ${styleClass}`}>
        <Loader className={'h-full ' + (color === ColorOptions.GRAY ? 'border-pink-500' : '')}/>
      </div>
    </button>;

}