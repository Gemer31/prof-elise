import { IOrder, IOrderSerialized, IProduct, IProductSerialized, IUser } from '@/app/models';

export function getSerializedUser(user: IUser): IUser<string, string[]> {
  return {
    ...user,
    orders: user.orders ? Object.keys(user.orders) : [],
    cartAndFavouritesRef: user.cartAndFavouritesRef?.id
  };
}

export function getOrdersSerialized(orders: IOrder[]): IOrderSerialized[] {
  return orders?.map(item => {
    return {...item, userRef: item.userRef.id};
  }) || [];
}

export function getProductSerialized(product: IProduct): IProductSerialized {
  return product ? {
    ...product,
    categoryRef: product.categoryRef.id
  } : null;
}

export function getProductsSerialized(products: IProduct[]): IProductSerialized[] {
  return products?.map((item) => getProductSerialized(item)) || [];
}