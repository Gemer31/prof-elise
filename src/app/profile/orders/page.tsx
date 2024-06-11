import { ProfileBase } from '@/components/view/ProfileBase';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { IOrder, IOrderSerialized, ISearchParams, IUser } from '@/app/models';
import { OrdersList } from '@/components/view/orders-list/OrdersList';
import chunk from 'lodash.chunk';
import { getPagesCount, getPaginateProps } from '@/utils/paginate.util';
import { SerializationUtil } from '@/utils/serialization.util';

export const fetchCache = 'force-no-store';

interface IOrdersPageProps {
  searchParams: ISearchParams;
}

export default async function OrdersPage(
  {searchParams}: IOrdersPageProps
) {
  const session = await getServerSession(authConfig);
  !session?.user && redirect(RouterPath.HOME);

  const paginateProps = getPaginateProps({
    ...searchParams,
    byAlfabet: null,
    byPrice: null,
    byDate: searchParams.byDate
      ? (searchParams.byDate !== 'desc' && searchParams.byDate !== 'asc') ? 'desc' : searchParams.byDate
      : 'desc'
  });
  paginateProps.baseRedirectUrl = RouterPath.ORDERS;

  const userDocumentSnapshot = await getDoc(doc(db, FirestoreCollections.USERS, session.user.email));
  const userSerialized: IUser<string[]> = SerializationUtil.getSerializedUser(userDocumentSnapshot.data() as IUser);
  const ordersQuery = await fetch(
    `${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/v1/orders?orderByKey=${paginateProps.orderByParams.key}&orderByValue=${paginateProps.orderByParams.value}&email=${userSerialized.email}`,
    {
      cache: 'no-store',
      next: {revalidate: 0}
      // "default" | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload"
    }
  );
  const orders: IOrder[] = await ordersQuery.json();
  paginateProps.pagesCount = getPagesCount(orders.length, searchParams.pageLimit);
  const ordersChunks = chunk(orders, searchParams.pageLimit);
  const ordersSerialized: IOrderSerialized[] = SerializationUtil.getSerializedOrders(ordersChunks[searchParams.page - 1]);

  return <>
    <ProfileBase activeRoute={RouterPath.ORDERS} userRole={userSerialized.role}>
      <OrdersList paginateProps={paginateProps} data={ordersSerialized}/>
    </ProfileBase>
  </>;
}