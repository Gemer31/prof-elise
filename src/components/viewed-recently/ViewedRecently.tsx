import { LOCALE, TRANSLATES } from '@/app/translates';
import { RouterPath } from '@/app/enums';
import { IConfig, IViewedRecently } from '@/app/models';
import Image from 'next/image';
import { ContentContainer } from '@/components/ContentContainer';
import Link from 'next/link';
import './viewed-recently.css';
import currency from 'currency.js';

interface IViewedRecentlyProps {
  config: IConfig;
  viewedRecently: IViewedRecently[];
}

export function ViewedRecently({config, viewedRecently}: IViewedRecentlyProps) {
  return viewedRecently?.length
    ? <div className="w-full bg-slate-100 flex flex-col items-center h-full py-4">
      <ContentContainer type="article" styleClass="px-2">
        <h2 className="text-xl font-bold">{TRANSLATES[LOCALE].youViewed}</h2>
        <div className="py-2 grid grid-cols-5 gap-x-2">
          {
            viewedRecently?.map(item => {
              return <Link
                href={`${RouterPath.CATEGORIES}/${item.product?.categoryId}${RouterPath.PRODUCTS}/${item.product?.id}`}
                key={item.product?.id}
                className="flex items-center p-4 rounded-md bg-white hover:bg-pink-200 duration-500 transition-colors"
              >
                <Image width={55} height={55} src={item.product?.imageUrls[0]} alt={item.product?.title}/>
                <div className="ml-2">
                  <div className="viewed-recently__card-title text-base">{item.product?.title}</div>
                  <div className="font-light">{currency(item.product?.price).toString()} {config.currency}</div>
                </div>
              </Link>;
            })
          }
        </div>
      </ContentContainer>
    </div>
    : <></>;
}