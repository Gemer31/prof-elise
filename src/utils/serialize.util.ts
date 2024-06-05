import { IUser } from '@/app/models';

export function getSerializedUser(user: IUser): IUser<string, string[]> {
  return {
    ...user,
    orders: user.orders ? Object.keys(user.orders) : [],
    cartAndFavouritesRef: user.cartAndFavouritesRef.id
  };
}