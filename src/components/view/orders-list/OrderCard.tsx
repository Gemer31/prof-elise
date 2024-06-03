import { IOrder, IProduct } from '@/app/models';
import { OrderStatuses, RouterPath } from '@/app/enums';
import Link from 'next/link';
import currency from 'currency.js';
import { LOCALE, TRANSLATES } from '@/app/translates';

const OrderStatusClasses = new Map([
  [OrderStatuses.CREATED, 'bg-yellow-300'],
  [OrderStatuses.COMPLETED, 'bg-emerald-600'],
  [OrderStatuses.CANCELLED, 'bg-gray-400'],
])

interface IOrderCardProps {
  data: IOrder;
}

export function OrderCard({data}: IOrderCardProps) {
  return <div className="flex flex-col p-2 bg-slate-100 rounded-md  mb-2">
    <div className="grid grid-cols-5 ">
      <div className="flex justify-center items-center font-medium text-lg">№ {data.number}</div>
      <div className="flex justify-center items-center">{new Date(data.createDate).toString()}</div>
      <div className="flex justify-center items-center">
        <span
          className={'p-2 px-4 rounded-md ' + OrderStatusClasses.get(data.status)}>{TRANSLATES[LOCALE][data.status]}</span>
      </div>
      <div className="flex justify-center items-center">{data.comment}</div>
      <div className="flex justify-center items-center">{data.totalPrice}</div>
    </div>
    <div className="w-full">
      {
        Object.values(data.products).map(item => {
          return <div key={item.id} className="grid-cols-3 grid">
            <Link className="flex justify-center items-center" href={`${RouterPath.CATEGORIES}/${item.categoryId}${RouterPath.PRODUCTS}/${item.id}`}>
              {item.title}
            </Link>
            <div className="flex justify-center items-center">{item.count} шт.</div>
            <div className="flex justify-center items-center">{item.price}/шт.</div>
          </div>
        })
      }
    </div>
  </div>

}