'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '@/utils/firebaseModule';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object().shape({
  email: yup.string().required('fieldRequired').email('fieldInvalid'),
  password: yup.string().required('fieldRequired')
});

export default function ProductDetails() {
  const inputClass: string = convertToClass([
    'border-2',
    'bg-custom-gray-100',
    'mt-1',
    'field-input',
    'w-full'
  ]);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
    }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = async (formData: { email: string; password: string }) => {
    setIsLoginError(false);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push(RouterPath.EDITOR);
    } catch (err) {
      setIsLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // todo: redirect if not found
  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
      <form
        className="flex flex-col items-center w-6/12"
        onSubmit={handleSubmit(submitForm)}
      >
        <label className="w-full pb-6 relative">
          <span className="mr-2">E-mail</span>
          <input
            className={inputClass}
            type="text"
            {...register('email')}
          />
          {
            errors?.email
              ? <div className="absolute text-red-500 text-xs bottom-2">{TRANSLATES[LOCALE][errors.email.message as string]}</div>
              : <></>
          }
        </label>
        <label className="w-full pb-6 relative">
          <span className="mr-2">{TRANSLATES[LOCALE].password}</span>
          <input
            className={inputClass}
            type="text"
            {...register('password')}
          />
          {
            errors?.password
              ? <div className="absolute text-red-500 text-xs bottom-2">{TRANSLATES[LOCALE][errors.password.message as string]}</div>
              : <></>
          }
        </label>

        <div className={isLoginError ? 'text-red-500 text-xs text-center mb-2' : 'invisible'}>
          {TRANSLATES[LOCALE].invalidLoginOrPassword}
        </div>

        <Button
          styleClass="text-amber-50 w-full px-4 py-2"
          disabled={isLoading}
          loading={isLoading}
          type={ButtonType.SUBMIT}
        >{TRANSLATES[LOCALE].enter}</Button>
      </form>
    </main>
  )
}