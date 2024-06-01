import { ContentContainer } from '@/components/ui/ContentContainer';
import { SubHeader } from '@/components/view/SubHeader';
import { SignInForm } from '@/components/view/forms/SignInForm';

export default async function SighInPage() {
  return <>
    <ContentContainer styleClass="flex flex-col items-center px-2 mb-4">
      <SubHeader/>
      <SignInForm/>
    </ContentContainer>
  </>;
}