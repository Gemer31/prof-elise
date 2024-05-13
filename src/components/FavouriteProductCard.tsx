import { IProduct } from '@/app/models';
import Image from 'next/image';
import { RouterPath } from '@/app/enums';
import { Counter } from '@/components/Counter';
import Link from 'next/link';

export interface IFavouriteProductCardProps {
  data: IProduct;
  isLoading?: boolean,
  onClick?: () => void,
}

export function FavouriteProductCard({data, isLoading, onClick}: IFavouriteProductCardProps) {
  return <div className="grid grid-cols-3">
    <Link
      className={(isLoading ? ' pointer-events-none' : '')}
      href={`${RouterPath.CATEGORIES}/${data.categoryRef.path.at(-1)}${RouterPath.PRODUCTS}/${data?.id}`}
      onClick={onClick}
    >
      <Image width={150} height={150} src={data.imageUrls[0]} alt={data.title}/>
      <span>{data.title}</span>
    </Link>
    <span>{data.price}</span>
    <Counter productId={data.id}/>
  </div>;
}