import Image from 'next/image';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';

export function AboutUs() {
  return (
    <ContentContainer styleClass="w-full flex justify-start items-center">
      <div>
        <div className="uppercase text-2xl mb-4">{TRANSLATES[LOCALE].сonsumablesWholesaleRetail}</div>
        <p>
          {TRANSLATES[LOCALE].aboutUsDescription}
        </p>
      </div>
      <Image width={400} height={400} src="/images/preview-girl.png" alt="About Us"/>
    </ContentContainer>
  );
}