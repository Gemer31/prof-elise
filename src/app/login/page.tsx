'use client';

import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { useRouter } from 'next/navigation';
import { ContentContainer } from '@/components/ContentContainer';
import { FormField } from '@/components/form-fields/FormField';
import path from 'path';
import { auth } from '@/app/lib/firebase-config';

const validationSchema = yup.object().shape({
  email: yup.string().required('fieldRequired').email('fieldInvalid'),
  password: yup.string().required('fieldRequired')
});

export default function ProductDetails() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = useCallback(async (formData: { email: string; password: string }) => {
    setIsLoginError(false);
    setIsLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const serverLoginResponse = await fetch(path.join(process.cwd(), 'api', 'login'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await userCred.user.getIdToken()}`
        }
      })
      if (serverLoginResponse.status === 200) {
        router.push(RouterPath.EDITOR);
      }
    } catch (err) {
      setIsLoginError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="w-full">
      <ContentContainer styleClass="flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
        <form
          className="flex flex-col items-center w-6/12"
          onSubmit={handleSubmit(submitForm)}
        >
          <FormField
            label="E-mail"
            name="email"
            type="text"
            error={errors.email?.message}
            register={register}
          />
          <FormField
            label={TRANSLATES[LOCALE].password}
            name="password"
            type="text"
            error={errors.password?.message}
            register={register}
          />
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
      </ContentContainer>
    </main>
  );
}