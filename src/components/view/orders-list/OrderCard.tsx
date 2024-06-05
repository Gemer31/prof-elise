import { IOrder, IUser } from '@/app/models';
import { OrderStatuses, RouterPath } from '@/app/enums';
import Link from 'next/link';
import { LOCALE, TRANSLATES } from '@/app/translates';
import './order-card.css';
import { useMemo } from 'react';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ORDER_STATUS_CLASSES } from '@/app/constants';

interface IOrderCardProps {
  data: IOrder<IUser>;
}

export function OrderCard({data}: IOrderCardProps) {
  const hostClass: string = useMemo(() => convertToClass([
    'relative',
    'flex',
    'flex-col',
    'p-4',
    'mb-2',
    'duration-200',
    'bg-slate-100 hover:bg-slate-200',
    'rounded-md',
  ]), []);

  return <div className={hostClass}>
    <div className="grid grid-cols-5">
      <div className="flex items-center font-medium text-lg z-10">№ {data.number}</div>
      <div className="flex items-center">{new Date(data.createDate).toISOString().split('T')[0]}</div>
      <div className="flex items-center">
        <span className={ORDER_STATUS_CLASSES.get(data.status)}>{TRANSLATES[LOCALE][data.status]}</span>
      </div>
      <div className="flex items-center">{data.comment || '—'}</div>
      <div className="flex justify-end items-center font-medium text-lg">{data.totalPrice}</div>
    </div>
    <input className="order-card-checkbox" type="checkbox"/>
    <div className="order-card-details w-full rounded-md p-2 mt-4 bg-white">
      {
        Object.values(data.products).map(item => {
          return <div key={item.id} className="grid-cols-3 grid">
            <Link className="flex hover:underline items-center flex-grow z-10 shrink"
                  href={`${RouterPath.CATEGORIES}/${item.categoryId}${RouterPath.PRODUCTS}/${item.id}`}>
              {item.title}
            </Link>
            <div className="flex justify-center items-center">{item.count} шт.</div>
            <div className="flex justify-end items-center text-lg">{item.price}/шт.</div>
          </div>
        })
      }
    </div>
  </div>

}