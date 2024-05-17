import { ICartProductModel, IConfig, IProduct } from '@/app/models';
import './cart-card.css';
import Image from 'next/image';
import { Counter } from '@/components/Counter';
import { EntityFavouriteButton } from '@/components/EntityFavouriteButton';
import currency from 'currency.js';
import Link from 'next/link';
import { RouterPath } from '@/app/enums';

export interface ICartCardProps {
  data: ICartProductModel<IProduct>;
  config: IConfig;
}

export function CartCard({data, config}: ICartCardProps) {
  return <div className="cart-card pb-2">
    <Link
      className="flex"
      href={`${RouterPath.CATEGORIES}/${data.productRef.categoryId}${RouterPath.PRODUCTS}/${data?.productRef.id}`}
    >
      <Image width={150} height={150} src={data?.productRef?.imageUrls[0]} alt={data.productRef.title}/>
      <div className="flex flex-col justify-between p-2">
        <div className="text-lg">{data.productRef.title}</div>
        <EntityFavouriteButton className="w-fit" productId={data.productRef.id}/>
      </div>
    </Link>
    <div className="flex justify-center items-center">
      <div className="text-center">
        <div className="font-bold separator">
          {currency(data.productRef.price).multiply(data.count).toString()} {config.currency}
        </div>
        <div className="text-sm">{currency(data.productRef.price).toString()} {config.currency}/шт.</div>
      </div>
    </div>
    <div className="flex justify-end items-center">
      <div className="h-fit">
        <Counter productId={data.productRef.id}/>
      </div>
    </div>
  </div>;
}