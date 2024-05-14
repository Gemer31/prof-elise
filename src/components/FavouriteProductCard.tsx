import { IConfig, IProduct } from '@/app/models';
import Image from 'next/image';
import { RouterPath } from '@/app/enums';
import { Counter } from '@/components/Counter';
import Link from 'next/link';

export interface IFavouriteProductCardProps {
  config: IConfig;
  data: IProduct;
  isLoading?: boolean,
  onClick?: () => void,
}

export function FavouriteProductCard({data, isLoading, config, onClick}: IFavouriteProductCardProps) {
  return <div className="grid grid-cols-3">
    <Link
      className={'flex gap-x-2 ' + (isLoading ? ' pointer-events-none' : '')}
      href={`${RouterPath.CATEGORIES}/${data.categoryId}${RouterPath.PRODUCTS}/${data?.id}`}
      onClick={onClick}
    >
      <Image width={150} height={150} src={data.imageUrls[0]} alt={data.title}/>
      <span>{data.title}</span>
    </Link>
    <span className="text-pink-500">{data.price} {config.currency}</span>
    <Counter productId={data.id}/>
  </div>;
}