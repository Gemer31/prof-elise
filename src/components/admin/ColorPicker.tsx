'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { ColorOptions } from '@/app/enums';
import { COLOR_OPTION_VALUES } from '@/app/constants';

export interface IColorPickerProps {
  value: ColorOptions;
  onChange: (newColor: ColorOptions) => void;
}

export function ColorPicker({onChange, value}: IColorPickerProps) {
  const [color, setColor] = useState<ColorOptions>();

  useEffect(() => {
    setColor(value || ColorOptions.PINK);
  }, []);

  const valueChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue: ColorOptions = event.target.value as ColorOptions;
    setColor(newValue);
    onChange?.(newValue);
  };

  return <div className="relative">
    {
      <div
        className={'absolute rounded-md top-1 bottom-1 left-1 right-1 w-[40px] ' + COLOR_OPTION_VALUES.get(value)?.split(' ')[0]}></div>
    }
    <select className="h-full w-[80px] rounded-md border-2" value={value} onChange={valueChange}>
      {
        Object.values(ColorOptions).map(item => (<option
            key={item}
            className={'w-[40px] ' + COLOR_OPTION_VALUES.get(item).split(' ')[0]}
            value={item}
          ></option>
        ))
      }
    </select>
  </div>;
}