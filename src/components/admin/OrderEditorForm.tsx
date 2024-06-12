import { LOCALE, TRANSLATES } from '@/app/translates';
import { FirestoreCollections, OrderStatuses } from '@/app/enums';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch } from '@/store/store';
import { SearchInput } from '@/components/ui/SearchInput';
import { collection, doc, getDocs, query, setDoc, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IOrder } from '@/app/models';
import { docsToData } from '@/utils/firebase.util';
import { Loader } from '@/components/ui/Loader';
import { ORDER_STATUS_CLASSES } from '@/app/constants';
import { setNotificationMessage } from '@/store/dataSlice';
import { revalidateOrders } from '@/app/actions';

interface IOrderEditorFormProps {
  refreshCallback?: () => void;
}

export function OrderEditorForm({refreshCallback}: IOrderEditorFormProps) {
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<IOrder>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const statusChanged = async (event: ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const newStatus: OrderStatuses = event.target.value as OrderStatuses;
    try {
      const res = await setDoc(
        doc(db, FirestoreCollections.ORDERS, order.id),
        {...order, status: newStatus}
      );
      setOrder(prev => ({...order, status: newStatus}));
      await revalidateOrders();
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].orderUpdateSuccessfully));
    } catch {
      dispatch(setNotificationMessage(TRANSLATES[LOCALE].somethingWentWrong));
    } finally {
      setIsLoading(false);
    }
  };

  const searchChanged = async (newValue: string) => {
    setSearchIsLoading(true);
    setSearchValue(newValue);
    const res = await getDocs(query(
      collection(db, FirestoreCollections.ORDERS),
      where('number', '==', Number(newValue))
    ));
    setOrder(docsToData<IOrder>(res.docs)?.[0]);
    setSearchIsLoading(false);
  };

  return <div>
    <SearchInput placeholder={TRANSLATES[LOCALE].enterOrderNumber} onChange={searchChanged}/>
    {
      searchIsLoading
        ? <div className="flex justify-center p-4"><Loader className="size-6 border-pink-500"/></div>
        : order
          ? <div className="flex justify-between items-center mt-2 p-4 bg-slate-100 rounded-md">
            <span className="font-medium text-lg">№{order.number}</span>
            <select
              className={ORDER_STATUS_CLASSES.get(order.status)}
              disabled={isLoading}
              value={order.status}
              onChange={statusChanged}
            >
              {
                Object.values(OrderStatuses).map(item => {
                  return <option
                    className={ORDER_STATUS_CLASSES.get(item)}
                    key={item}
                    value={item}
                  >{TRANSLATES[LOCALE][item]}</option>;
                })
              }
            </select>
          </div>
          : searchValue?.length
            ? <div className="text-center p-4">{TRANSLATES[LOCALE].nothingFound}</div>
            : <div className="text-center p-4">{TRANSLATES[LOCALE].enterOrderNumber}</div>
    }
  </div>;
}