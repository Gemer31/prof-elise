import { Popup } from '@/components/Popup';
import { LOCALE, TRANSLATES } from '@/app/constants';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { convertToClass } from '@/utils/convert-to-class.util';
import path from 'path';

export const validationSchema = yup.object().shape({
  name: yup.string().required().matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().matches(/^(80|375|\+375)\d{9}$/)
});


export interface RequestCallPopupProps {
  closeCallback: () => void;
}

export function RequestCallPopup({closeCallback}: RequestCallPopupProps) {
  const {
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input'
    // error?.message ? ' border-custom-red-50' : 'border-custom-yellow-100',
  ]);

  // const submitForm = async (formData: FormDataFields) => {
  //   setIsLoading(true);
  //
  //   const message: string = `Имя: ${formData.name};\nТелефон: ${formData.phone};\nПроблема: ${formData.description}`
  //   const result = await fetch(path.join(process.cwd(), 'api', 'form'), {
  //     method: 'POST',
  //     body: JSON.stringify({ message: encodeURI(message) })
  //   });
  //
  //   setNotificationVisibleClass(FADE_IN_RIGHT_CLASS);
  //   setIsLoading(false);
  //
  //   setTimeout(() => setNotificationVisibleClass(FADE_OUT_RIGHT_CLASS), 3000);
  // }

  return (
    <Popup title={TRANSLATES[LOCALE].requestCall} closeCallback={() => closeCallback()}>
      <form className="flex flex-col items-center" onSubmit={() => {
      }}>
        <label className="mb-4">
          <span className="mr-2">{TRANSLATES[LOCALE].yourName}</span>
          <input
            className={inputClass}
            type="text"
            {...register('name')}
          />
        </label>
        <Button
          styleClass="text-amber-50"
          type={ButtonType.SUBMIT}
          callback={() => {
          }}
        >{TRANSLATES[LOCALE].send}</Button>
      </form>
    </Popup>
  );
}