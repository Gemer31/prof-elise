import { DocumentReference } from '@firebase/firestore';
import { ColorOptions } from '@/app/enums';

export interface IProduct {
  id: string;
  vendorCode: string;
  title: string;
  price: string;
  description: string;
  categoryRef: DocumentReference;
  categoryId?: string;
  labels: ILabel[];
  imageUrls?: string[];
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

