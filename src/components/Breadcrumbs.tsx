import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import { ICategory, IProduct } from '@/app/models';
import Link from 'next/link';
import { RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface IBreadcrumbsProps {
  category?: ICategory;
  product?: IProduct;
  links?: {
    title: string;
    href?: string;
  }[];
}

export function Breadcrumbs({category, product, links}: IBreadcrumbsProps) {
  return (
    <ContentContainer styleClass="w-full flex items-center py-4">
      <div className="w-[20px] min-w-[20px]">
        <Link className="block" href={RouterPath.HOME}>
          {TRANSLATES[LOCALE].main}
        </Link>
      </div>
      {
        links?.map((link, index) => {
          return <div className="flex items-center text-base" key={link.title + index}>
            <div className="w-[20px] min-w-[20px]">
              <Image width={20} height={20} src="/icons/arrow.svg" alt="Arrow"/>
            </div>
            <div className="overflow-ellipsis text-nowrap overflow-hidden w-[32vw]">
              {
                link.href
                  ? <Link href={link.href}>{link.title}</Link>
                  : <span>{link.title}</span>
              }
            </div>
          </div>;
        })
      }

      {/*{*/}
      {/*  category*/}
      {/*    ? <div className="flex items-center text-base">*/}
      {/*      <Image width={20} height={20} src="/icons/arrow.svg" alt="Arrow"/>*/}
      {/*      <Link*/}
      {/*        className="overflow-ellipsis text-nowrap overflow-hidden max-w-[32vw]"*/}
      {/*        key={category.id}*/}
      {/*        href={RouterPath.CATEGORIES + '/' + category.id}*/}
      {/*      >{category.title}</Link>*/}
      {/*    </div>*/}
      {/*    : <></>*/}
      {/*}*/}
      {/*{*/}
      {/*  product*/}
      {/*    ? <div className="flex items-center text-base">*/}
      {/*      <div className="w-[20px] min-w-[20px]">*/}
      {/*        <Image width={20} height={20} src="/icons/arrow.svg" alt="Arrow"/>*/}
      {/*      </div>*/}
      {/*      <Link*/}
      {/*        className="overflow-ellipsis text-nowrap overflow-hidden w-[32vw]"*/}
      {/*        key={product.id}*/}
      {/*        href={RouterPath.CATEGORIES + '/' + product.id}*/}
      {/*      >{product.title}</Link>*/}
      {/*    </div>*/}
      {/*    : <></>*/}
      {/*}*/}
    </ContentContainer>
  );
}