'use client';

import * as yup from 'yup';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { SubHeader } from '@/components/view/SubHeader';

const validationSchema = yup.object().shape({
  email: yup.string().required('fieldRequired').email('fieldInvalid'),
  password: yup.string().required('fieldRequired')
});

export default function RegistrationPage() {

  return <>
    <ContentContainer styleClass="flex flex-col items-center px-2 mb-4">
      <SubHeader/>
      {/*{*/}
      {/*  loading || !isAuthChecked*/}
      {/*    ? <div className="w-full flex justify-center mt-4 overflow-hidden"><Loader*/}
      {/*      className="min-h-[250px] border-pink-500"/></div>*/}
      {/*    : <form*/}
      {/*      className="shadow-md rounded-md p-6 border-2 flex flex-col items-center w-6/12"*/}
      {/*      onSubmit={handleSubmit(submitForm)}*/}
      {/*    >*/}
      {/*      <InputFormField*/}
      {/*        placeholder="E-mail"*/}
      {/*        label="E-mail"*/}
      {/*        name="email"*/}
      {/*        type="text"*/}
      {/*        error={errors.email?.message}*/}
      {/*        register={register}*/}
      {/*      />*/}
      {/*      <InputFormField*/}
      {/*        placeholder={TRANSLATES[LOCALE].password}*/}
      {/*        label={TRANSLATES[LOCALE].password}*/}
      {/*        name="password"*/}
      {/*        type="text"*/}
      {/*        error={errors.password?.message}*/}
      {/*        register={register}*/}
      {/*      />*/}
      {/*      <div className={isLoginError ? 'text-red-500 text-xs text-center mb-2' : 'invisible'}>*/}
      {/*        {TRANSLATES[LOCALE].invalidLoginOrPassword}*/}
      {/*      </div>*/}
      {/*    <Link href={RouterPath.SIGN_IN}>{TRANSLATES[LOCALE].invalidLoginOrPassword}</Link>*/}
      {/*      <Button*/}
      {/*        styleClass="text-amber-50 w-full px-4 py-2"*/}
      {/*        disabled={isLoading}*/}
      {/*        loading={isLoading}*/}
      {/*        type={ButtonTypes.SUBMIT}*/}
      {/*      >{TRANSLATES[LOCALE].registrate}</Button>*/}
      {/*    </form>*/}
      {/*}*/}
    </ContentContainer>
  </>
}