import { ProfileBase } from '@/components/view/ProfileBase';
import { FirestoreCollections, OrderByKeys, PageLimits, RouterPath } from '@/app/enums';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { redirect } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  OrderByDirection,
  query,
  QueryConstraint,
  where
} from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IOrder, IProduct, IUser } from '@/app/models';
import { OrdersList } from '@/components/view/orders-list/OrdersList';
import { getPaginateUrl } from '@/utils/router.util';
import { docsToData } from '@/utils/firebase.util';
import { ORDER_BY_FIELDS } from '@/app/constants';
import chunk from 'lodash.chunk';

interface IOrdersPageProps {
  searchParams: {
    pageCount: number;
    pageLimit: number;
    page: number;
    byPrice: OrderByDirection;
    byDate: OrderByDirection;
    byAlfabet: OrderByDirection;
  };
}

export default async function OrdersPage(
  {searchParams}: IOrdersPageProps
) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect(RouterPath.HOME);
  }

  let orderByKey: OrderByKeys;
  let orderByValue: OrderByDirection;
  Object.keys(searchParams)?.every(key => {
    switch (key) {
      case OrderByKeys.BY_PRICE: {
        orderByKey = OrderByKeys.BY_PRICE;
        orderByValue = searchParams[OrderByKeys.BY_PRICE];
        break;
      }
      case OrderByKeys.BY_DATE: {
        orderByKey = OrderByKeys.BY_DATE;
        orderByValue = searchParams[OrderByKeys.BY_DATE];
        break;
      }
      case OrderByKeys.BY_ALFABET: {
        orderByKey = OrderByKeys.BY_ALFABET;
        orderByValue = searchParams[OrderByKeys.BY_ALFABET];
        break;
      }
    }
    if (orderByValue) {
      if (orderByValue !== 'desc' && orderByValue !== 'asc') {
        orderByValue = 'desc';
      }
      return false;
    }
    return true;
  });

  if (!Object.values<string>(PageLimits).includes(String(searchParams.pageLimit))) {
    redirect(getPaginateUrl({
      baseUrl: RouterPath.ORDERS,
      page: 1,
      pageLimit: Number(PageLimits.SIX),
      orderBy: {
        key: orderByKey,
        value: orderByValue
      }
    }));
  }

  const userQuerySnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session.user.email));
  const user = (userQuerySnapshot.data() as IUser);

  const ordersFilters: QueryConstraint[] = [where('id', 'in', Object.keys(user.orders))];
  const orderByField: string = ORDER_BY_FIELDS.get(orderByKey);
  if (orderByField) {
    ordersFilters.push(orderBy(orderByField, orderByValue));
  }
  const ordersQuerySnapshot = await getDocs(query(collection(db, FirestoreCollections.ORDERS), ...ordersFilters));

  const pagesCount: number = ordersQuerySnapshot.docs.length
    ? Math.ceil(ordersQuerySnapshot.docs.length / searchParams.pageLimit)
    : 0;

  const ordersChunks = chunk(ordersQuerySnapshot.docs, searchParams.pageLimit);
  const orders: IOrder[] = docsToData<IOrder>(ordersChunks[searchParams.page - 1]);

  return <>
    <ProfileBase activeRoute={RouterPath.PROFILE} userRole={user.role}>
      <OrdersList
        page={searchParams.page}
        pageLimit={searchParams.pageLimit}
        pagesCount={searchParams.pageCount}
        data={orders}
      />
    </ProfileBase>
  </>;
}