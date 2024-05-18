'use client';

import { Popup } from '@/components/Popup';
import { Button } from '@/components/Button';
import { ButtonTypes } from '@/app/enums';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setNotificationMessage, setRequestCallPopupVisible } from '@/store/dataSlice';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { InputFormField } from '@/components/form-fields/InputFormField';
import { PhoneFormField } from '@/components/form-fields/PhoneFormField';

const validationSchema = yup.object().shape({
  name: yup.string().required('fieldRequired').matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required('fieldRequired')
});

export function RequestCallPopup() {
  const dispatch = useAppDispatch();
  const requestCallPopupVisible = useAppSelector(
    state => state.dataReducer.requestCallPopupVisible
  );
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = async (formData: { name?: string; phone?: string }) => {
    setIsLoading(true);

    const message: string = `Заказать звонок\n\nИмя: ${formData.name};\nТелефон: ${formData.phone}`;
    await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/bot`, {
      method: 'POST',
      body: JSON.stringify({message: encodeURI(message)})
    });

    setIsLoading(false);

    dispatch(setNotificationMessage(TRANSLATES[LOCALE].requestCallSended));
    dispatch(setRequestCallPopupVisible(false));
  };

  const [popupClass, setPopupClass] = useState('opacity-0 z-0');

  useEffect(() => {
    if (requestCallPopupVisible) {
      setPopupClass('opacity-1 z-30');
    } else {
      setPopupClass('opacity-0 z-30');
      setTimeout(() => {
        setPopupClass('opacity-0 z-0');
      }, 200);
    }
  }, [requestCallPopupVisible]);

  return (
    <Popup
      styleClass={`slow-appearance ${popupClass}`}
      title={TRANSLATES[LOCALE].requestCall}
      closeCallback={() => dispatch(setRequestCallPopupVisible(false))}
    >
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit(submitForm)}
      >
        <InputFormField
          required={true}
          placeholder={TRANSLATES[LOCALE].enterName}
          label={TRANSLATES[LOCALE].yourName}
          name="name"
          type="text"
          error={errors.name?.message}
          register={register}
        />
        <PhoneFormField
          required={true}
          label={TRANSLATES[LOCALE].phone}
          name="phone"
          type="text"
          error={errors.phone?.message}
          register={register}
        />
        <div className="w-full mt-4">
          <Button
            styleClass="text-amber-50 w-full py-2"
            disabled={isLoading}
            loading={isLoading}
            type={ButtonTypes.SUBMIT}
          >{TRANSLATES[LOCALE].send}</Button>
        </div>
      </form>
    </Popup>
  );
}