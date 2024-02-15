'use client'

import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { useInView } from 'react-intersection-observer';
import { handleInView } from '@/utils/handle-intersection.util';
import { FADE_IN_LEFT_CLASS, FADE_IN_UP_CLASS } from '@/app/constants';
import { useEffect } from 'react';

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
export function Advantages() {
  const {ref: ref1, inView: inView1} = useInView({
    triggerOnce: true,
  });

  return (
    <div className="hidden md:block py-4">
      <h2 className="text-center uppercase mb-4 text-xl md:bold md:mb-2">{TRANSLATES[LOCALE].ourAdvantages}</h2>
      <div className="flex justify-between md:block">
        {
          advantagesItems.map((item, index) => {
            return (
              <div
                ref={ref1}
                key={index}
                className={'mb-2 flex items-center ' + handleInView(inView1, FADE_IN_UP_CLASS, 500 * index)}
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