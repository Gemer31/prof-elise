import { ProfileBase } from '@/components/view/ProfileBase';
import { FirestoreCollections, RouterPath } from '@/app/enums';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/configs/auth.config';
import { redirect } from 'next/navigation';
import { doc, getDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import {
  IOrder,
  IOrderSerialized,
  ISearchParams,
  IUser,
  IUserSerialized,
} from '@/app/models';
import { OrdersList } from '@/components/view/orders-list/OrdersList';
import chunk from 'lodash.chunk';
import { getPagesCount, getPaginateProps } from '@/utils/paginate.util';
import { SerializationUtil } from '@/utils/serialization.util';
import { getOrders } from '@/utils/firebase.util';

interface IOrdersPageProps {
  searchParams: ISearchParams;
}

export default async function OrdersPage({ searchParams }: IOrdersPageProps) {
  const session = await getServerSession(authConfig);
  !session?.user && redirect(RouterPath.HOME);

  const paginateProps = getPaginateProps({
    ...searchParams,
    byAlfabet: null,
    byPrice: null,
    byDate: searchParams.byDate
      ? searchParams.byDate !== 'desc' && searchParams.byDate !== 'asc'
        ? 'desc'
        : searchParams.byDate
      : 'desc',
  });
  paginateProps.baseRedirectUrl = RouterPath.ORDERS;

  const userDocumentSnapshot = await getDoc(
    doc(db, FirestoreCollections.USERS, session.user.email)
  );
  const userSerialized: IUserSerialized = SerializationUtil.getSerializedUser(
    userDocumentSnapshot.data() as IUser
  );
  const orders: IOrder[] = await getOrders({
    orderByKey: paginateProps.orderByParams.key,
    orderByValue: paginateProps.orderByParams.value,
    email: userSerialized.email,
  });
  paginateProps.pagesCount = getPagesCount(
    orders.length,
    searchParams.pageLimit
  );
  const ordersChunks = chunk(orders, searchParams.pageLimit);
  const ordersSerialized: IOrderSerialized[] =
    SerializationUtil.getSerializedOrders(ordersChunks[searchParams.page - 1]);

  return (
    <>
      <ProfileBase
        activeRoute={RouterPath.ORDERS}
        userRole={userSerialized.role}
      >
        <OrdersList paginateProps={paginateProps} data={ordersSerialized} />
      </ProfileBase>
    </>
  );
}
