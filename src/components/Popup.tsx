import { CommonProps } from '@/app/models';
import Image from 'next/image';
import { useClickAway } from '@uidotdev/usehooks';

export interface PopupProps extends CommonProps {
  title: string;
  closeCallback: () => void;
}

export function Popup({ children, styleClass, title, closeCallback }: PopupProps) {
  const ref = useClickAway<HTMLInputElement>(closeCallback);

  return (
    <div className={`flex justify-center items-center fixed w-full h-full bg-black-1/2 ${styleClass}`}>
      <div ref={ref} className="flex flex-col justify-center bg-gray-200 rounded-2xl">
        <div className="flex justify-between items-center p-4">
          <span className="text-xl">{title}</span>
          <div className="cursor-pointer" onClick={closeCallback}>
            <Image width={40} height={40} src="/icons/cross.svg" alt="Close"/>
          </div>
        </div>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}