import { DocumentReference, OrderByDirection } from '@firebase/firestore';
import { ColorOptions, OrderByKeys, OrderStatuses, PopupTypes, UserRoles } from '@/app/enums';

export interface IProduct<T = DocumentReference> {
  id: string;
  vendorCode: string;
  title: string;
  price: number;
  description: string;
  categoryRef: T;
  labels: ILabel[];
  imageUrls?: string[];
  createDate: number;
}

export type IProductSerialized = IProduct<string>;

export type IProductEnriched = IProduct<ICategory>;

export interface ILabel {
  text: string;
  color?: ColorOptions;
}

export interface ICommonProps {
  children: React.ReactNode,
  styleClass?: string;
}

export interface IConfig {
  contactPhone: string;
  currency: string;
  workingHours: string;
  shopDescription: string;
  deliveryDescription: string;
  shopRegistrationDescription: string;
}

export interface ICategory {
  id: string;
  title: string;
  imageUrl: string;
  relatedCategories?: string[];
  productsTotal: number;
}

export interface IViewedRecently {
  time: number;
  product: IProductSerialized;
}

export interface ICartProductModel<T = DocumentReference> {
  count: number;
  productRef: T;
}

export interface IViewedRecentlyModel<T = DocumentReference> {
  time: number;
  productRef: T;
}

export interface IClient {
  cart?: Record<string, ICartProductModel>;
  favourites?: Record<string, DocumentReference>;
  viewedRecently?: Record<string, IViewedRecentlyModel>;
}

export interface IInitStore {
  cart?: Record<string, ICartProductModel<string>>;
  favourites?: Record<string, string>;
  viewedRecently?: Record<string, IViewedRecentlyModel<string>>;
}

export interface IClientEnriched {
  cart?: Record<string, ICartProductModel<IProductSerialized>>;
  favourites?: Record<string, IProduct>;
  viewedRecently?: Record<string, IViewedRecentlyModel<IProduct>>;
}

export interface IPopupData {
  formType: PopupTypes;
  product?: IProductSerialized;
}

export interface IOrderByModel {
  key: OrderByKeys | string;
  value: OrderByDirection;
}

export interface IOrder<T = DocumentReference> {
  id: string;
  userRef: T;
  status: OrderStatuses;
  number: number;
  createDate: number;
  totalPrice: number;
  products: Record<string, IOrderProduct>;
  comment?: string;
}

export type IOrderSerialized = IOrder<string>;

export interface IOrderProduct {
  id: string;
  count: number;
  price: string;
  title: string;
  categoryId: string;
}

export interface IUser<T = DocumentReference, E = Record<string, DocumentReference>> {
  email: string;
  role: UserRoles;
  cartAndFavouritesRef: T;
  orders: E;
  phone?: string;
  name?: string;
  deliveryAddress?: string;
}

export type IUserSerialized = IUser<string, string[]>;

export interface IPaginateProps extends IPaginateOptions {
  baseRedirectUrl?: string;
  page?: number;
  pagesCount?: number;
  pageLimit?: number;
}

export interface IPaginateOptions {
  orderByParams?: IOrderByModel;
  minPrice?: number;
  maxPrice?: number;
  searchValue?: string;
}

export interface ISearchParams {
  pageLimit?: number;
  page?: number;
  byPrice?: OrderByDirection;
  byDate?: OrderByDirection;
  byAlfabet?: OrderByDirection;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}
