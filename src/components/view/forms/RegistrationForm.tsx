'use client';

import { InputFormField } from '@/components/ui/form-fields/InputFormField';
import { LOCALE, TRANSLATES } from '@/app/translates';
import Link from 'next/link';
import { ButtonTypes, FirestoreCollections, RouterPath, UserRoles } from '@/app/enums';
import { Button } from '@/components/ui/Button';
import { Form } from '@/components/ui/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneFormField } from '@/components/ui/form-fields/PhoneFormField';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth, db } from '@/app/lib/firebase-config';
import { useAppDispatch } from '@/store/store';
import { setNotificationMessage } from '@/store/dataSlice';
import { signIn } from 'next-auth/react';
import { AddPrefixToKeys, doc, setDoc } from '@firebase/firestore';
import { getClientId } from '@/utils/cookies.util';
import { YupUtil } from '@/utils/yup.util';

export function RegistrationForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
    resolver: yupResolver(YupUtil.RegistrationSchema)
  });

  const submitForm = useCallback(async (
    {
      name,
      phone,
      email,
      password
    }: {
      name?: string;
      phone?: string;
      email?: string;
      password?: string;
    }) => {
    setIsLoginError(false);
    setIsLoading(true);

    try {
      const registerRes = await createUserWithEmailAndPassword(auth, email, password);
      // TODO: think about cart if it was deleted from cookies but registered user exists
      const saveUserDataRes = await setDoc(
        doc(db, FirestoreCollections.USERS, email),
        {
          name,
          phone,
          email,
          role: UserRoles.USER,
          clientId: getClientId(),
          orders: {}
        } as AddPrefixToKeys<string, any>
      );
      const signInRes = await signIn(
        'credentials',
        {email, password, redirect: false}
      );
      if (signInRes && !signInRes.error) {
        router.push(RouterPath.PROFILE);
      }
    } catch (e) {
      console.error(e);
      // @ts-ignore
      const translateMessage: string = TRANSLATES[LOCALE][e.message] || TRANSLATES[LOCALE].somethingWentWrong;
      dispatch(setNotificationMessage(translateMessage));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return <Form
    title={TRANSLATES[LOCALE].registrationOnSite}
    onSubmit={handleSubmit(submitForm)}
  >
    <InputFormField
      placeholder={TRANSLATES[LOCALE].enterFio}
      label={TRANSLATES[LOCALE].fio}
      name="name"
      type="text"
      error={errors.name?.message}
      register={register}
    />
    <PhoneFormField
      label={TRANSLATES[LOCALE].enterContactPhoneNumber}
      type="text"
      name="phone"
      error={errors.phone?.message}
      register={register}
    />
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
    <InputFormField
      required={true}
      hideValueAvailable={true}
      placeholder={TRANSLATES[LOCALE].repeatPassword}
      label={TRANSLATES[LOCALE].repeatPassword}
      name="passwordRepeat"
      type="text"
      error={errors.passwordRepeat?.message}
      register={register}
    />
    {/*TODO: captcha*/}
    <div className={isLoginError ? 'text-red-500 text-xs text-center mb-2' : 'invisible'}>
      {TRANSLATES[LOCALE].invalidLoginOrPassword}
    </div>
    <Link className="text-pink-500 underline py-2"
          href={RouterPath.SIGN_IN}>{TRANSLATES[LOCALE].alreadyRegisteredEnter}</Link>
    <Button
      styleClass="text-amber-50 w-full px-4 py-2"
      disabled={isLoading}
      loading={isLoading}
      type={ButtonTypes.SUBMIT}
    >{TRANSLATES[LOCALE].registrate}</Button>
  </Form>;
}