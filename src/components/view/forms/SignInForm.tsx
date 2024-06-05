'use client';

import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { LOCALE, TRANSLATES } from '@/app/translates';
import Link from 'next/link';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { Button } from '@/components/ui/Button';
import { Form } from '@/components/ui/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { YupUtil } from '@/utils/yup.util';
import { setNotificationMessage } from '@/store/dataSlice';
import { useAppDispatch } from '@/store/store';

export function SignInForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(YupUtil.SignInSchema)
  });

  const submitForm = useCallback(async ({email, password}: { email?: string; password?: string }) => {
    setIsLoading(true);
    const res = await signIn('credentials', {email, password, redirect: false});
    if (res?.ok) {
      router.push(RouterPath.PROFILE);
    } else {
      console.error('Login failed: ', res?.error);
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].invalidLoginOrPassword));
    }
    setIsLoading(false);
  }, []);

  return <Form
    title={TRANSLATES[LOCALE].enterOnSite}
    onSubmit={handleSubmit(submitForm)}
  >
    <InputFormField
      required={true}
      placeholder="E-mail"
      label="E-mail"
      name="email"
      type="text"
      error={errors.email?.message}
      register={register}
    />
    <InputFormField
      required={true}
      hideValueAvailable={true}
      placeholder={TRANSLATES[LOCALE].password}
      label={TRANSLATES[LOCALE].password}
      name="password"
      type="text"
      error={errors.password?.message}
      register={register}
    />
    <div className="w-full flex justify-around py-2 underline">
      <Link className="text-gray-400"
            href={RouterPath.FORGOT_PASSWORD}>{TRANSLATES[LOCALE].forgotPassword}</Link>
      <Link className="text-pink-500"
            href={RouterPath.REGISTRATION}>{TRANSLATES[LOCALE].registrationOnSite}</Link>
    </div>
    <Button
      styleClass="text-amber-50 w-full px-4 py-2"
      disabled={isLoading}
      loading={isLoading}
      type={ButtonTypes.SUBMIT}
    >{TRANSLATES[LOCALE].enter}</Button>
  </Form>;
}