import currency from 'currency.js';
import Image from 'next/image';
import Link from 'next/link';
import { ICartProductModel, IConfig, IProductSerialized } from '@/app/models';
import './cart-card.css';
import { Counter } from '@/components/view/Counter';
import { EntityFavouriteButton } from '@/components/view/EntityFavouriteButton';
import { ButtonTypes, RouterPath } from '@/app/enums';
import { Button } from '@/components/ui/Button';

export interface ICartCardProps {
  data: ICartProductModel<IProductSerialized>;
  config: IConfig;
  onDelete: () => void;
}

export function CartCard({ data, config, onDelete }: ICartCardProps) {
  return (
    <div className="cart-card pb-2 bg-slate-100 p-2 rounded-md mb-2">
      <Link
        className="flex"
        href={`${RouterPath.CATEGORIES}/${data.productRef.categoryRef}${RouterPath.PRODUCTS}/${data?.productRef.id}`}
      >
        <Image
          className="rounded-md"
          width={150}
          height={150}
          src={data?.productRef?.imageUrls[0]}
          alt={data.productRef.title}
        />
        <div className="flex flex-col justify-between p-2">
          <div className="text-lg entity-card-title">
            {data.productRef.title}
          </div>
          <div className="flex items-center gap-x-2">
            <EntityFavouriteButton
              className="w-fit"
              productId={data.productRef.id}
            />
            <Button
              styleClass="px-2 py-1"
              type={ButtonTypes.BUTTON}
              callback={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete();
              }}
            >
              ✖
            </Button>
          </div>
        </div>
      </Link>
      <div className="flex justify-center items-center">
        <div className="text-center">
          <div className="font-bold separator">
            {currency(data.productRef.price).multiply(data.count).toString()}{' '}
            {config.currency}
          </div>
          <div className="text-sm">
            {currency(data.productRef.price).toString()} {config.currency}/шт.
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <div className="h-fit">
          <Counter productId={data.productRef.id} min={1} />
        </div>
      </div>
    </div>
  );
}
