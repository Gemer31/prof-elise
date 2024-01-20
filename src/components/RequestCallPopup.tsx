import { Popup } from '@/components/Popup';
import { LOCALE, TRANSLATES } from '@/app/constants';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { convertToClass } from '@/utils/convert-to-class.util';
import { useAppDispatch } from '@/store/store';
import { setNotificationMessage, setRequestCallPopupVisible } from '@/store/dataSlice';
import { useForm } from 'react-hook-form';
import path from 'path';
import { useState } from 'react';
import { Loader } from '@/components/loader/loader';

export const validationSchema = yup.object().shape({
  name: yup.string().required().matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required().matches(/^(80|375|\+375)\d{9}$/)
});

export function RequestCallPopup() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
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
    'field-input',
  ]);

  const submitForm = async (formData: { name: string; phone: string }) => {
    setIsLoading(true);

    const message: string = `Имя: ${formData.name};\nТелефон: ${formData.phone}`;
    const result = await fetch(path.join(process.cwd(), 'api', 'form'), {
      method: 'POST',
      body: JSON.stringify({message: encodeURI(message)})
    });

    dispatch(setNotificationMessage(TRANSLATES[LOCALE].requestCallSended));
    dispatch(setRequestCallPopupVisible(false));

    setIsLoading(false);
  };

  return (
    <Popup
      title={TRANSLATES[LOCALE].requestCall}
      closeCallback={() => dispatch(setRequestCallPopupVisible(false))}
    >
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit(submitForm)}
      >
        <label className="mb-4">
          <span className="mr-2">{TRANSLATES[LOCALE].yourName}</span>
          <input
            className={inputClass}
            type="text"
            {...register('name')}
          />
        </label>

        <Button
          styleClass="text-amber-50 w-full"
          disabled={isLoading}
          type={ButtonType.SUBMIT}
        >{
          isLoading
            ? <Loader styleClass="w-[24px] h-[24px]"/>
            : TRANSLATES[LOCALE].send
        }</Button>
      </form>
    </Popup>
  );
}