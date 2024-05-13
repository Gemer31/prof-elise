import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import Link from 'next/link';
import { RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface IBreadcrumbsProps {
  links?: {
    title: string;
    href?: string;
  }[];
}

export function Breadcrumbs({links}: IBreadcrumbsProps) {
  return (
    <ContentContainer styleClass="w-full flex items-center py-4">
      <Link className="block" href={RouterPath.HOME}>
        {TRANSLATES[LOCALE].main}
      </Link>
      {
        links?.map((link, index) => {
          return <div className="flex items-center text-base" key={link.title + index}>
            <div className="w-[20px] min-w-[20px]">
              <Image className="rotate-90" width={20} height={20} src="/icons/arrow.svg" alt="Arrow"/>
            </div>
            <div className="overflow-ellipsis text-nowrap overflow-hidden">
              {
                link.href
                  ? <Link href={link.href}>{link.title}</Link>
                  : <span>{link.title}</span>
              }
            </div>
          </div>;
        })
      }
    </ContentContainer>
  );
}