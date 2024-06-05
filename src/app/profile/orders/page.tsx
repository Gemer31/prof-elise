import { ProfileBase } from '@/components/view/ProfileBase';
import { FirestoreCollections, OrderByKeys, PageLimits, RouterPath } from '@/app/enums';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { redirect } from 'next/navigation';
import { doc, getDoc, orderBy, OrderByDirection, QueryConstraint, where } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IOrder, IUser, IUserSerialized } from '@/app/models';
import { OrdersList } from '@/components/view/orders-list/OrdersList';
import { getPaginateUrl } from '@/utils/router.util';
import { ORDER_BY_FIELDS } from '@/app/constants';
import chunk from 'lodash.chunk';
import { getPagesCount } from '@/utils/paginate.util';
import { getSerializedUser } from '@/utils/serialize.util';

export const fetchCache = 'force-no-store';

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

  let orderByKey: OrderByKeys = OrderByKeys.BY_DATE;
  let orderByValue: OrderByDirection = searchParams[OrderByKeys.BY_DATE];
  if (orderByValue !== 'desc' && orderByValue !== 'asc') {
    orderByValue = 'desc';
  }

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

  const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session.user.email));
  const userSerialized: IUser<string, string[]> = getSerializedUser(userDocumentSnapshot.data() as IUser);

  const ordersFilters: QueryConstraint[] = [where('userRef', '==', doc(db, FirestoreCollections.USERS, userSerialized.email))];
  const orderByField: string = ORDER_BY_FIELDS.get(orderByKey);
  if (orderByField) {
    ordersFilters.push(orderBy(orderByField, orderByValue));
  }
  const ordersQuery = await fetch(
    `${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/v1/orders?orderByKey=${orderByKey}&orderByValue=${orderByValue}&email=${userSerialized.email}`,
    {
      cache: 'reload',
      next: { revalidate: 100 }
      // "default" | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload"
    }
  );
  let orders: IOrder[] = await ordersQuery.json();

  const pagesCount: number = getPagesCount(orders.length, searchParams.pageLimit);

  const ordersChunks = chunk(orders, searchParams.pageLimit);
  delete userSerialized.orders;
  const ordersSerialized: IOrder<IUserSerialized>[] = ordersChunks[searchParams.page - 1]
    .map(item => {
      delete item.userRef;
      return {...item, userRef: userSerialized};
    });

  return <>
    <ProfileBase activeRoute={RouterPath.ORDERS} userRole={userSerialized.role}>
      <OrdersList
        page={Number(searchParams.page)}
        pageLimit={searchParams.pageLimit}
        pagesCount={pagesCount}
        orderByParams={{
          key: orderByKey,
          value: orderByValue
        }}
        data={ordersSerialized}
      />
    </ProfileBase>
  </>;
}