import { Popup } from '@/components/Popup';
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
import { LOCALE, TRANSLATES } from '@/app/translates';

const validationSchema = yup.object().shape({
  name: yup.string().required().matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required().matches(/^(80|375|\+375)\d{9}$/)
});

export function RequestCallPopup() {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input'
  ]);

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

  const submitForm = async (formData: { name: string; phone: string }) => {
    setIsLoading(true);

    console.log(path.join(process.cwd(), 'api', 'form'));
    const message: string = `Заказать звонок\n\nИмя: ${formData.name};\nТелефон: ${formData.phone}`;
    const result = await fetch(path.join(process.cwd(), 'api', 'bot'), {
      method: 'POST',
      body: JSON.stringify({message: encodeURI(message)})
    });

    setIsLoading(false);

    dispatch(setNotificationMessage(TRANSLATES[LOCALE].requestCallSended));
    dispatch(setRequestCallPopupVisible(false));
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
        <label className="mb-4">
          <span className="mr-2">{TRANSLATES[LOCALE].phone}</span>
          <input
            className={inputClass}
            type="text"
            {...register('phone')}
          />
        </label>

        <Button
          styleClass="text-amber-50 w-full py-2"
          disabled={isLoading}
          loading={isLoading}
          type={ButtonType.SUBMIT}
        >{TRANSLATES[LOCALE].send}</Button>
      </form>
    </Popup>
  );
}