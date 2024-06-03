import { DocumentReference, OrderByDirection } from '@firebase/firestore';
import { ColorOptions, OrderByKeys, OrderStatuses, PopupTypes, UserRoles } from '@/app/enums';

export interface IProduct {
  id: string;
  vendorCode: string;
  title: string;
  price: number;
  description: string;
  categoryRef: DocumentReference;
  categoryId?: string;
  labels: ILabel[];
  imageUrls?: string[];
  createDate: number;
}

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
  product: IProduct;
}

export interface ICartProductModel<T = DocumentReference> {
  count: number;
  productRef: T;
}

export interface IViewedRecentlyModel<T> {
  time: number;
  productRef: T;
}

export interface IClient {
  cart?: Record<string, ICartProductModel<DocumentReference>>;
  favourites?: Record<string, DocumentReference>;
  viewedRecently?: Record<string, IViewedRecentlyModel<DocumentReference>>;
}

export interface IClientEnriched {
  cart?: Record<string, ICartProductModel<IProduct>>;
  favourites?: Record<string, IProduct>;
  viewedRecently?: Record<string, IViewedRecentlyModel<IProduct>>;
}

export interface IPopupData {
  formType: PopupTypes;
  product?: IProduct;
}

export interface IOrderByModel {
  key: OrderByKeys;
  value: OrderByDirection;
}

export interface IOrder {
  id: string;
  status: OrderStatuses;
  number: number;
  createDate: number;
  totalPrice: number;
  products: Record<string, IOrderProduct>;
  comment?: string;
}

export interface IOrderProduct {
  id: string;
  count: number;
  price: string;
  title: string;
  categoryId: string;
}

export interface IUser {
  email: string;
  role: UserRoles;
  cartAndFavouritesRef: DocumentReference;
  orders: Record<string, IOrder>;
  phone?: string;
  name?: string;
  deliveryAddress?: string;
}