import { IConfig, IProduct } from '@/app/models';
import Image from 'next/image';
import { RouterPath } from '@/app/enums';
import { Counter } from '@/components/Counter';
import Link from 'next/link';
import './favourite-product-card.css';

export interface IFavouriteProductCardProps {
  config: IConfig;
  data: IProduct;
  isLoading?: boolean,
  onClick?: () => void,
}

export function FavouriteProductCard({data, isLoading, config, onClick}: IFavouriteProductCardProps) {
  return <div className="favourite-product-card">
    <Link
      className={'flex items-center gap-x-2 ' + (isLoading ? ' pointer-events-none' : '')}
      href={`${RouterPath.CATEGORIES}/${data.categoryId}${RouterPath.PRODUCTS}/${data?.id}`}
      onClick={onClick}
    >
      <Image width={150} height={150} src={data.imageUrls[0]} alt={data.title}/>
      <span className="favourite-product-card__title ml-2">{data.title}</span>
    </Link>
    <span className="flex justify-center items-center text-pink-500 text-center font-medium text-xl">
      {data.price} {config.currency}
    </span>
    <div className="flex items-center justify-end">
      <div className="h-fit flex">
        <Counter productId={data.id}/>
      </div>
    </div>
  </div>;
}