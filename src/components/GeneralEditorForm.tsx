import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections } from '@/app/enums';
import { useEffect, useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { InputMask } from '@react-input/mask';
import { doc, DocumentData, setDoc, WithFieldValue } from '@firebase/firestore';
import { db } from '@/utils/firebaseModule';
import { FIREBASE_DATABASE_NAME } from '@/app/constants';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';

const validationSchema = yup.object().shape({
  phone: yup.string().required(),
  shopDescription: yup.string().required(),
});

export interface IFirebaseGeneralEditorInfo {
  contactPhone: {
    stringValue: string;
  };
  shopDescription: {
    stringValue: string;
  }
}

interface GeneralEditorFormProps {
  firebaseData: IFirebaseGeneralEditorInfo;
  refreshData?: () => void;
}

export function GeneralEditorForm({ firebaseData, refreshData }: GeneralEditorFormProps) {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    if (firebaseData) {
      setValue('phone', firebaseData.contactPhone.stringValue);
      setValue('shopDescription', firebaseData.shopDescription.stringValue);
    }
  }, [firebaseData]);

  const submitForm = async (formData: { phone: string, shopDescription: string }) => {
    setIsLoading(true);
    const data: WithFieldValue<DocumentData> = {
      shopDescription: formData.shopDescription,
      contactPhone: formData.phone,
    }
    try {
      await setDoc(doc(db, FIREBASE_DATABASE_NAME, FirebaseCollections.CONFIG), data);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].infoSaved));
      refreshData?.();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(submitForm)}
    >
      <label className="w-full mb-2 relative">
        <span className="mr-2">{TRANSLATES[LOCALE].phone}</span>
        <InputMask
          placeholder="+375 (99) 999-99-99"
          mask="+375 (__) ___-__-__"
          replacement={{_: /\d/}}
          className={inputClass}
          type="text"
          {...register('phone')}
        />
        {
          errors?.phone
            ? <div
              className="absolute text-red-500 text-xs bottom-2">{TRANSLATES[LOCALE][errors.phone.message as string]}</div>
            : <></>
        }
      </label>
      <label className="mb-4">
        <span className="mr-2">{TRANSLATES[LOCALE].mainShopInfo}</span>
        <input
          className={inputClass}
          type="text"
          {...register('shopDescription')}
        />
      </label>
      <Button
        styleClass="text-amber-50 w-full py-2"
        disabled={isLoading}
        loading={isLoading}
        type={ButtonType.SUBMIT}
      >{TRANSLATES[LOCALE].save}</Button>
    </form>
  )
}