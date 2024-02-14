import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import { ICategory, IProduct } from '@/app/models';
import Link from 'next/link';
import { RouterPath } from '@/app/enums';

interface IBreadcrumbsProps {
  category?: ICategory;
  product?: IProduct;
}

export function Breadcrumbs({category, product}: IBreadcrumbsProps) {
  return (
    <ContentContainer styleClass="w-full flex items-center py-4">
      <Link href={RouterPath.HOME}>
        <Image width={30} height={30} src="/icons/home.svg" alt="Home"/>
      </Link>
      {
        category
          ? <div className="flex items-center text-xl">
            <Image width={25} height={25} src="/icons/arrow.svg" alt="Arrow"/>
            <Link
              className=""
              key={category.id}
              href={RouterPath.CATEGORIES + '/' + category.id}
            >{category.title}</Link>
          </div>
          : <></>
      }
      {
        product
          ? <div className="flex items-center text-xl">
            <Image width={25} height={25} src="/icons/arrow.svg" alt="Arrow"/>
            <Link
              className="overflow-ellipsis text-nowrap overflow-hidden max-w-96"
              key={product.id}
              href={RouterPath.CATEGORIES + '/' + product.id}
            >{product.title}</Link>
          </div>
          : <></>
      }
    </ContentContainer>
  );
}