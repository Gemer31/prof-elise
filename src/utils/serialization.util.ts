import {
  ICartProductModel,
  IOrder,
  IOrderSerialized,
  IProduct,
  IProductSerialized,
  IUser,
  IUserSerialized,
  IViewedRecentlyModel
} from '@/app/models';
import { doc, DocumentReference } from '@firebase/firestore';
import { FirestoreCollections } from '@/app/enums';
import { db } from '@/app/lib/firebase-config';

export class SerializationUtil {
  static getSerializedUser(user: IUser): IUserSerialized {
    const orders: Record<string, string> = {};
    user.orders && Object.values(user.orders).forEach(item => {
      orders[item.id] = item.id;
    })
    return {...user, orders};
  }

  static getSerializedCart(cart: Record<string, ICartProductModel>): Record<string, ICartProductModel<string>> {
    const serialized: Record<string, ICartProductModel<string>> = {};
    Object.keys(cart).forEach(key => {
      serialized[key] = {
        count: cart[key].count,
        productRef: cart[key].productRef.id
      };
    });
    return serialized;
  }
  static getNonSerializedCart(cart: Record<string, ICartProductModel<string>>): Record<string, ICartProductModel> {
    const nonSerialized: Record<string, ICartProductModel> = {};
    Object.keys(cart).forEach(key => {
      nonSerialized[key] = {
        count: cart[key].count,
        productRef: doc(db, FirestoreCollections.PRODUCTS, cart[key].productRef),
      };
    });
    return nonSerialized;
  }

  static getSerializedFavourites(favourites: Record<string, DocumentReference>): Record<string, string> {
    const serialized: Record<string, string> = {};
    Object.keys(favourites).forEach(key => serialized[key] = favourites[key].id);
    return serialized;
  }
  static getNonSerializedFavourites(favourites: Record<string, string>): Record<string, DocumentReference> {
    const nonSerialized: Record<string, DocumentReference> = {};
    Object.keys(favourites)?.forEach(key => {
      nonSerialized[key] = doc(db, FirestoreCollections.FAVOURITES, favourites[key]);
    });
    return nonSerialized;
  }

  static getSerializedViewedRecently(viewedRecently: Record<string, IViewedRecentlyModel>): Record<string, IViewedRecentlyModel<string>> {
    const serialized: Record<string, IViewedRecentlyModel<string>> = {};
    Object.keys(viewedRecently).forEach(key => {
      serialized[key] = {
        time: viewedRecently[key].time,
        productRef: viewedRecently[key].productRef.id
      };
    });
    return serialized;
  }

  static getSerializedProduct(product: IProduct): IProductSerialized {
    return product ? {
      ...product,
      categoryRef: product.categoryRef.id
    } : null;
  }
  static getSerializedProducts(products: IProduct[]): IProductSerialized[] {
    return products?.map((item) => SerializationUtil.getSerializedProduct(item)) || [];
  }

  static getSerializedOrders(orders: IOrder[]): IOrderSerialized[] {
    return orders?.map(item => {
      return {...item, userRef: item.userRef.id};
    }) || [];
  }
}