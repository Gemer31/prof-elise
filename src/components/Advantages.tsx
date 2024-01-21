import Image from 'next/image';
import { LOCALE, TRANSLATES } from '@/app/constants';

export function Advantages() {
  return (
    <div className="py-4">
      <div className="text-xl bold">
        {TRANSLATES[LOCALE].advantages}
      </div>
      <div className="flex items-center">
        <Image width={35} height={35} src="/icons/delivery.svg" alt="Car"/>
        <span className="ml-2 text-base">{TRANSLATES[LOCALE].deliveryAdvantage}</span>
      </div>
    </div>
  )
}