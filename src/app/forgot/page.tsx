import { ContentContainer } from '@/components/ui/ContentContainer';
import { SubHeader } from '@/components/view/SubHeader';

export default function ForgotPage() {
  return <>
    <ContentContainer styleClass="flex flex-col items-center px-2 mb-4">
      <SubHeader/>
      {/*<form*/}
      {/*  className="shadow-md rounded-md p-6 border-2 flex flex-col items-center w-6/12"*/}
      {/*  onSubmit={handleSubmit(submitForm)}*/}
      {/*>*/}
      {/*  <InputFormField*/}
      {/*    placeholder="E-mail"*/}
      {/*    label="E-mail"*/}
      {/*    name="email"*/}
      {/*    type="text"*/}
      {/*    error={errors.email?.message}*/}
      {/*    register={register}*/}
      {/*  />*/}
      {/*  <Button*/}
      {/*    styleClass="text-amber-50 w-full px-4 py-2"*/}
      {/*    disabled={isLoading}*/}
      {/*    loading={isLoading}*/}
      {/*    type={ButtonTypes.SUBMIT}*/}
      {/*  >{TRANSLATES[LOCALE].enter}</Button>*/}
      {/*</form>*/}
    </ContentContainer>
  </>
}