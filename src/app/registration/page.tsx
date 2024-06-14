'use client';

import { ContentContainer } from '@/components/ui/ContentContainer';
import { SubHeader } from '@/components/view/SubHeader';
import { RegistrationForm } from '@/components/view/forms/RegistrationForm';

export default function RegistrationPage() {
  return (
    <>
      <ContentContainer styleClass="flex flex-col items-center px-2 mb-4">
        <SubHeader />
        <RegistrationForm />
      </ContentContainer>
    </>
  );
}
