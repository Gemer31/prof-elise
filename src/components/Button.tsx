import { CommonProps } from '@/app/models';
import { Simulate } from 'react-dom/test-utils';
import click = Simulate.click;
import { ButtonType } from '@/app/enums';

export interface ButtonProps extends CommonProps {
  type: 'button' | 'submit';
  styleClass?: string;
  callback: () => void;
}

export function Button({ children, callback, type, styleClass }: ButtonProps) {
  return (
    <button
      type={type || ButtonType.BUTTON}
      className={'flex justify-center items-center px-4 py-2 bg-pink-500 rounded-md h-fit ' + styleClass}
      onClick={() => callback()}
    >{children}</button>
  )
}