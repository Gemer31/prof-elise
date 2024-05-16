'use client';

import { ICartProductModel, IConfig, IProduct } from '@/app/models';
import './cart-card.css';
import Image from 'next/image';
import { Counter } from '@/components/Counter';
import { EntityFavouriteButton } from '@/components/EntityFavouriteButton';

export interface ICartCardProps {
  data: ICartProductModel<IProduct>;
  config: IConfig;
}
export function CartCard({data, config }: ICartCardProps) {
  return <div className="cart-card pb-2">
    <Image width={150} height={150} src={data?.productRef?.imageUrls[0]} alt={data.productRef.title}/>
    <div className="flex flex-col justify-between p-2">
      <div className="text-lg">{data.productRef.title}</div>
      <EntityFavouriteButton className="w-fit" productId={data.productRef.id}/>
    </div>
    <div className="flex justify-center items-center">
      <div className="text-center">
        <div className="font-bold separator">{Number(data.productRef.price) * data.count} {config.currency}</div>
        <div className="text-sm">{data.productRef.price} {config.currency} / шт.</div>
      </div>
    </div>
    <div className="flex justify-end items-center">
      <Counter productId={data.productRef.id}/>
    </div>
  </div>
}