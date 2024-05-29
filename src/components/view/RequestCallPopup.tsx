'use client';

import { Popup } from '@/components/ui/Popup';
import { Button } from '@/components/ui/Button';
import { ButtonTypes, PopupTypes } from '@/app/enums';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setNotificationMessage, setPopupData } from '@/store/dataSlice';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { PhoneFormField } from '@/components/ui/form-fields/PhoneFormField';
import { IPopupData } from '@/app/models';
import { TextareaFormField } from '@/components/ui/form-fields/TextareaFormField';

const validationSchema = yup.object().shape({
  name: yup.string().required('fieldRequired').matches(/^[A-Za-zА-Яа-я ]+$/),
  phone: yup.string().required('fieldRequired'),
  comment: yup.string()
});

export function RequestCallPopup() {
  const dispatch = useAppDispatch();
  const timer = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const popupData: IPopupData = useAppSelector(state => state.dataReducer.popupData);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = async (formData: { name?: string; phone?: string; comment?: string }) => {
    setIsLoading(true);

    let message: string;
    if (popupData.formType === PopupTypes.REQUEST_CALL) {
      message = `Заказать звонок\n\nИмя: ${formData.name};\nТелефон: ${formData.phone}`;
    } else {
      message = `Купить в один клик\n\nИмя: ${formData.name};\nТелефон: ${formData.phone}`;
      if (formData.comment?.length) {
        message += (';\nКомментарий: ' + formData.comment);
      }
      message += `\n\n- ${popupData.product.title}`;
    }

    await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/bot`, {
      method: 'POST',
      body: JSON.stringify({message: encodeURI(message)})
    });

    setIsLoading(false);

    dispatch(setNotificationMessage(TRANSLATES[LOCALE].requestCallSended));
    dispatch(setPopupData(null));
    reset();
  };

  const [hostClass, setHostClass] = useState('opacity-0 z-0');

  useEffect(() => {
    setIsVisible(!!popupData);
  }, [popupData]);

  useEffect(() => {
    if (isVisible) {
      setHostClass('opacity-1 z-30');
    } else {
      setHostClass('opacity-0 z-30');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        dispatch(setPopupData(null));
        setHostClass('opacity-0 z-0');
      }, 200);
    }
  }, [isVisible]);

  return (
    <Popup
      styleClass={`slow-appearance ${hostClass}`}
      title={popupData?.formType === PopupTypes.REQUEST_CALL ? TRANSLATES[LOCALE].requestCall : TRANSLATES[LOCALE].buyInOneClick}
      closeCallback={() => setIsVisible(false)}
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
        {
          popupData?.formType === PopupTypes.BUY_IN_ONE_CLICK
            ? <TextareaFormField
              placeholder={TRANSLATES[LOCALE].comment}
              label={TRANSLATES[LOCALE].comment}
              name="comment"
              error={errors.comment?.message}
              register={register}
            />
            : <></>
        }
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