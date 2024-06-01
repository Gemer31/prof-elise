'use client'

import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { LOCALE, TRANSLATES } from '@/app/translates';
import Link from 'next/link';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { Button } from '@/components/ui/Button';
import { Form } from '@/components/ui/Form';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object().shape({
  email: yup.string().required('fieldRequired').email('fieldInvalid'),
  password: yup.string().required('fieldRequired')
});

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema)
  });

  const submitForm = useCallback(async ({email, password}: { email?: string; password?: string }) => {
    setIsLoginError(false);
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {email, password, redirect: false});
      console.log(res)
      if (res && !res.error) {
        router.push(RouterPath.PROFILE);
      }
    } catch (err) {
      console.error('Login failed: ', err);
      setIsLoginError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return <Form
    title={TRANSLATES[LOCALE].enterOnSite}
    onSubmit={handleSubmit(submitForm)}
  >
    <InputFormField
      placeholder="E-mail"
      label="E-mail"
      name="email"
      type="text"
      error={errors.email?.message}
      register={register}
    />
    <InputFormField
      placeholder={TRANSLATES[LOCALE].password}
      label={TRANSLATES[LOCALE].password}
      name="password"
      type="text"
      error={errors.password?.message}
      register={register}
    />
    <div className={isLoginError ? 'text-red-500 text-xs text-center mb-2' : 'invisible'}>
      {TRANSLATES[LOCALE].invalidLoginOrPassword}
    </div>
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
  </Form>
}