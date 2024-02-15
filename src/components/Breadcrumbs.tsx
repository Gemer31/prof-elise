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
      <div className="w-[20px] min-w-[20px]">
        <Link className="block" href={RouterPath.HOME}>
          <Image width={20} height={20} src="/icons/home.svg" alt="Home"/>
        </Link>
      </div>

      {
        category
          ? <div className="flex items-center text-base">
            <Image width={20} height={20} src="/icons/arrow.svg" alt="Arrow"/>
            <Link
              className="overflow-ellipsis text-nowrap overflow-hidden max-w-[32vw]"
              key={category.id}
              href={RouterPath.CATEGORIES + '/' + category.id}
            >{category.title}</Link>
          </div>
          : <></>
      }
      {
        product
          ? <div className="flex items-center text-base">
            <div className="w-[20px] min-w-[20px]">
              <Image width={20} height={20} src="/icons/arrow.svg" alt="Arrow"/>
            </div>
            <Link
              className="overflow-ellipsis text-nowrap overflow-hidden w-[32vw]"
              key={product.id}
              href={RouterPath.CATEGORIES + '/' + product.id}
            >{product.title}</Link>
          </div>
          : <></>
      }
    </ContentContainer>
  );
}