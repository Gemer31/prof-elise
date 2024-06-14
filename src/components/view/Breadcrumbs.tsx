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

export function Breadcrumbs({ links }: IBreadcrumbsProps) {
  return (
    <section className="w-full py-4 flex overflow-hidden">
      <Link className="block" href={RouterPath.HOME}>
        {TRANSLATES[LOCALE].main}
      </Link>
      {links?.map((link, index) => (
        <div
          className={
            'max-w-96 flex items-center text-base overflow-ellipsis ' +
            (index === links.length - 1 ? 'text-pink-500' : '')
          }
          // eslint-disable-next-line react/no-array-index-key
          key={link.title + index}
        >
          <div className="w-[20px] min-w-[20px]">
            <Image
              className="rotate-90"
              width={20}
              height={20}
              src="/icons/arrow.svg"
              alt="Arrow"
            />
          </div>
          <div className="overflow-ellipsis text-nowrap overflow-hidden">
            {link.href ? (
              <Link href={link.href}>{link.title}</Link>
            ) : (
              <span title={link.title}>{link.title}</span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
