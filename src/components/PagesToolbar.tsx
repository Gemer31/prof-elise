'use client';

import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';

interface IPagesToolbarProps {
  pages: number;
  current: number;
}

export function PagesToolbar({current, pages}: IPagesToolbarProps) {
  return <div className={'w-full justify-center gap-x-2 ' + (pages < 2 ? 'hidden' : 'flex')}>
    {
      Array(pages).fill(null).map((item, index) => {
        const value: number = index + 1;
        return <Button
          styleClass={'px-4 py-2 text-white ' + (current === value ? '' : '')}
          type={ButtonType.BUTTON}
        >{value}</Button>
      })
    }
  </div>
}