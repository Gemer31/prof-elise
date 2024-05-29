'use client';

import { Button } from '@/components/ui/Button';
import { ButtonTypes, ColorOptions } from '@/app/enums';
import { useEffect, useState } from 'react';
import { ILabel } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { ColorPicker } from '@/components/admin/ColorPicker';

export interface IProductLabelsEditorProps {
  value: ILabel[];
  onChange: (newLabels: ILabel[]) => void;
}

export function ProductLabelsEditor({onChange, value}: IProductLabelsEditorProps) {
  const [labels, setLabels] = useState<ILabel[]>([]);

  useEffect(() => {
    onChange?.(labels);
  }, [labels]);

  useEffect(() => {
    let updateRequired: boolean = JSON.stringify(value) !== JSON.stringify(labels);
    if (updateRequired) {
      setLabels(value || []);
    }
  }, [value]);

  const labelsChange = (labelIndex: number, text?: string, color?: ColorOptions) => {
    setLabels(prev => {
      return prev?.map((item, index) => {
        return index === labelIndex
          ? {
            text: text === undefined ? item.text : text,
            color: color === undefined ? item.color : color
          }
          : item;
      });
    });
  };
  const deleteLabel = (deleteIndex: number) => {
    setLabels(prev => {
        const newLabels = prev.filter((item, index) => index !== deleteIndex);
        return newLabels;
      }
    );
  };
  const addLabel = () => {
    setLabels(prev => {
      const newLabels = [...prev];
      newLabels.push({
        text: '',
        color: ColorOptions.PINK
      });
      return newLabels;
    });
  };

  return <div className="flex flex-col gap-y-2">
    {
      labels?.map((item, index) => {
        return <div key={index} className="flex gap-x-2">
          <input
            className="w-full border-2 rounded-md px-2.5 py-1"
            placeholder={TRANSLATES[LOCALE].enterLabel}
            type="text"
            value={item.text}
            onChange={(e) => labelsChange(index, e.target.value)}
          />
          <ColorPicker
            value={item.color}
            onChange={(newColor) => labelsChange(index, undefined, newColor)}
          />
          <Button
            styleClass="h-full px-2 py-1"
            type={ButtonTypes.BUTTON} callback={() => deleteLabel(index)}>✖</Button>
        </div>;
      })
    }
    <Button
      styleClass="w-full text-xl py-2"
      color={ColorOptions.GRAY}
      type={ButtonTypes.BUTTON}
      callback={addLabel}
    >+</Button>
  </div>;
}