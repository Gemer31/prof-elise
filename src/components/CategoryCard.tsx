import { useMemo } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { RouterPath } from '@/app/enums';
import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/app/models';
import { Loader } from '@/components/Loader';

export interface ICategoryCardProps {
  data: ICategory,
  isLoading?: boolean,
  onClick?: () => void,
}

export function CategoryCard({data, isLoading, onClick}: ICategoryCardProps) {
  const cardClass = useMemo(() => convertToClass([
    'relative',
    'flex',
    'flex-col',
    'items-center',
    'justify-between',
    'rounded-lg',
    'p-4',
    'border-2 border-pink-200',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
  ]), []);
  const titleClass = useMemo(() => convertToClass([
    'text-lg',
    'min-h-6',
    'h-full',
    'flex',
    'justify-center',
    'items-center',
    'text-center',
    'text-sm',
    'md:text-base',
    'mt-2',
    'entity-card-title'
  ]), []);

  return (
    <Link
      className={cardClass + (isLoading ? ' pointer-events-none' : '')}
      href={`${RouterPath.CATEGORIES}/${data.id}`}
      onClick={onClick}
    >
      <Image
        className="rounded-md h-[200px] w-[200px]"
        width={200}
        height={200}
        src={data?.imageUrl || ''}
        alt={data?.title || ''}
      />
      <h3 className={titleClass}>{data?.title}</h3>
      {
        isLoading
          ? <div className="w-full h-full absolute top-0 flex justify-center items-center bg-black-1/5">
              <Loader className="h-[50px] border-pink-500"
            /></div>
          : <></>
      }
    </Link>
  );
}