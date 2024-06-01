import { ICommonProps } from '@/app/models';
import { FormEventHandler } from 'react';

interface IFormProps extends ICommonProps {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function Form({onSubmit, title, children}: IFormProps) {
  return <form
    className="shadow-md rounded-md p-6 border-2 flex flex-col items-center w-6/12"
    onSubmit={onSubmit}
  >
    <h1 className="text-center text-2xl font-medium">{title}</h1>
    {children}
  </form>;
}