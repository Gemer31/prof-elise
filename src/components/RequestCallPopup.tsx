import { Popup } from '@/components/Popup';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@/store/store';
import { setNotificationMessage, setRequestCallPopupVisible } from '@/store/dataSlice';
import { useForm } from 'react-hook-form';
import path from 'path';
import { useState } from 'react';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { FormField } from '@/components/form-fields/FormField';
import { PhoneFormField } from '@/components/form-fields/PhoneFormField';

const validationSchema = yup.object().shape({
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
        <FormField
          label={TRANSLATES[LOCALE].yourName}
          name="name"
          type="text"
          error={errors.name?.message}
          register={register}
        />
        <PhoneFormField
          label={TRANSLATES[LOCALE].phone}
          name="phone"
          type="text"
          error={errors.phone?.message}
          register={register}
        />
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