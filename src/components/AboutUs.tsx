import Image from 'next/image';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';

export interface IAboutUsProps {
  text: string;
}

export function AboutUs({ text }: IAboutUsProps) {
  return (
    <ContentContainer styleClass="w-full flex justify-start items-center">
      <div>
        <div className="uppercase text-2xl mb-4">{TRANSLATES[LOCALE].сonsumablesWholesaleRetail}</div>
        <p>{text}</p>
      </div>
      <Image width={400} height={400} src="/images/preview-girl.png" alt="About Us"/>
    </ContentContainer>
  );
}