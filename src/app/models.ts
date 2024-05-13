import { DocumentReference } from '@firebase/firestore';

export interface IProduct {
  id: string;
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
  color?: string;
}

export interface ICommonProps {
  children: React.ReactNode,
  styleClass?: string;
}

export interface IConfig {
  nextOrderNumber: number;
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
}
