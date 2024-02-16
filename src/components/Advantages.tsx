'use client'

import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useInView } from 'react-intersection-observer';
import { handleInView } from '@/utils/handle-intersection.util';
import { FADE_IN_LEFT_CLASS, FADE_IN_UP_CLASS } from '@/app/constants';
import { useEffect } from 'react';
import { CommonProps } from '@/app/models';

const advantagesItems = [
  {
    icon: '/icons/delivery.svg',
    text: TRANSLATES[LOCALE].deliveryAdvantage,
  },
  {
    icon: '/icons/delivery.svg',
    text: TRANSLATES[LOCALE].deliveryAdvantage,
  },
  {
    icon: '/icons/delivery.svg',
    text: TRANSLATES[LOCALE].deliveryAdvantage,
  }
]

interface IAdvantagesProps {
  styleClass?: string;
}

export function Advantages({ styleClass }: IAdvantagesProps) {
  const {ref: ref1, inView: inView1} = useInView({
    triggerOnce: true,
  });

  return (
    <div className={'py-4 ' + styleClass}>
      <h2 className="text-center uppercase mb-4 text-xl md:bold md:mb-2">{TRANSLATES[LOCALE].ourAdvantages}</h2>
      <div className="flex flex-col 3xs:flex-row justify-between gap-x-1 md:gap-x-0 md:block">
        {
          advantagesItems.map((item, index) => {
            return (
              <div
                ref={ref1}
                key={index}
                className={'flex items-center ' + handleInView(inView1, FADE_IN_UP_CLASS, 500 * index)}
              >
                <Image width={35} height={35} src={item.icon} alt="Car"/>
                <span className="ml-2 text-base">{item.text}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}