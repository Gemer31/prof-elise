import { ReactNode } from 'react';

interface IReadonlyFormFieldProps {
  label: string;
  value?: ReactNode;
}

export function ReadonlyFormField({label, value}: IReadonlyFormFieldProps) {
  return <div className="flex justify-between items-end">
    <span className="text-lg">{label}:</span>
    <span>{value || '—'}</span>
  </div>
}