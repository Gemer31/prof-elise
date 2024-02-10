'use client';

import Image from 'next/image';
import { ContentContainer } from '@/components/ContentContainer';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useInView } from 'react-intersection-observer';
import { handleInView } from '@/utils/handle-intersection.util';
import { FADE_IN_LEFT_CLASS, FADE_IN_RIGHT_CLASS } from '@/app/constants';

export interface IAboutUsProps {
  text: string;
}

export function AboutUs({text}: IAboutUsProps) {
  const {ref: ref1, inView: inView1} = useInView({
    triggerOnce: true
  });
  const {ref: ref2, inView: inView2} = useInView({
    triggerOnce: true
  });

  return (
    <ContentContainer styleClass="w-full flex justify-start items-center">
      <div
        ref={ref1}
        className={handleInView(inView1, FADE_IN_LEFT_CLASS)}
      >
        <div
          ref={ref1}
          className="uppercase text-2xl mb-4"
        >{TRANSLATES[LOCALE].сonsumablesWholesaleRetail}</div>
        <div
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{__html: text}}
        />
      </div>
      <Image
        ref={ref2}
        style={{position: 'relative', top: '1rem'}}
        className={handleInView(inView2, FADE_IN_RIGHT_CLASS)}
        width={400}
        height={400}
        src="/images/preview-girl.png"
        alt="About Us"
      />
    </ContentContainer>
  );
}