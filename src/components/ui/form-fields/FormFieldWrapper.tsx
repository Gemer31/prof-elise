import { LOCALE, TRANSLATES } from '@/app/translates';
import { ICommonProps } from '@/app/models';

export interface IFormFieldWrapperProps extends ICommonProps {
  required?: boolean;
  label: string;
  error?: string;
}

export function FormFieldWrapper({required, label, children, error}: IFormFieldWrapperProps) {
  return (
    <label className="w-full pb-4 relative">
      <span className={`mr-2 ${required ? 'field-label' : ''}`}>{label}</span>
      {children}
      {
        error
          ? <div className="absolute text-red-500 text-xs bottom-0">{TRANSLATES[LOCALE][error]}</div>
          : <></>
      }
    </label>
  );
}