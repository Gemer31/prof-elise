import Image from 'next/image';

export function Cart() {
  const cartAmount = 12;

  return (
    <div className="relative cursor-pointer rounded-full border-2 border-pink-500 bg-amber-50 m-1">
      <Image className="p-2" width={45} height={45} src="/icons/cart.svg" alt="Cart"/>
      <div className="absolute text-white text-xs bg-pink-500 rounded-full top-[4px] right-[4px] p-1">{cartAmount}</div>
    </div>
  );
}