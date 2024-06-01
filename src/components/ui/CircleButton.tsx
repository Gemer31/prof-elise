'use client'

import { useMemo } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ICommonProps } from '@/app/models';
import Link from 'next/link';

interface ICircleButtonProps extends ICommonProps {
  target?: string;
  href?: string;
  onClick?: () => void;
}

export function CircleButton({href, target, onClick, styleClass, children}: ICircleButtonProps) {
  const hostClass: string = useMemo(() => convertToClass([
    'flex',
    'justify-center',
    'items-center',
    'rounded-full',
    'border-2',
    'border-pink-500',
    'bg-white',
    'm-1',
    'hover:bg-pink-100',
    'duration-500',
    'transition-all'
  ]), []);

  return <div className={`${hostClass} ${styleClass || ''}`} onClick={() => onClick?.()}>
    {
      href ? <Link target={target || '_self'} href={href}>{children}</Link> : children
    }
  </div>;
}