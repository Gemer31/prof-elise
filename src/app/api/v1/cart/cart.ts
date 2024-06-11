import {
  collection,
  doc,
  getDocs,
  orderBy,
  OrderByDirection,
  query,
  QueryConstraint,
  where
} from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections, OrderByKeys } from '@/app/enums';
import { ORDER_BY_FIELDS } from '@/app/constants';
import { docsToData } from '@/utils/firebase.util';
import { IOrder } from '@/app/models';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderByKey: OrderByKeys = searchParams.get('orderByKey') as OrderByKeys;
  const orderByValue: OrderByDirection = searchParams.get('orderByValue') as OrderByDirection;
  const email: string = searchParams.get('email');

  try {
    const ordersFilters: QueryConstraint[] = [
      where('userRef', '==', doc(db, FirestoreCollections.USERS, email))
    ];
    const orderByField: string = ORDER_BY_FIELDS.get(orderByKey);
    if (orderByField) {
      ordersFilters.push(orderBy(orderByField, orderByValue));
    }
    const ordersQuerySnapshot = await getDocs(query(collection(db, FirestoreCollections.ORDERS), ...ordersFilters));
    const orders: IOrder[] = docsToData<IOrder>(ordersQuerySnapshot.docs);

    return new Response(JSON.stringify(orders), {status: 200});
  } catch (err) {
    return new Response(`{ message: ${err}`, {status: 500});
  }
}
