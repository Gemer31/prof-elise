import Image from 'next/image';

export function PulsatingCircle() {
  return <div className="pulsating-circle">
    <Image width={20} height={20} src="/icons/tick.svg" alt="Success"/>
  </div>
}