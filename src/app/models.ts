import { DocumentReference } from '@firebase/firestore';

export interface IProduct {
  id: string;
  title: string;
  price: string;
  description: string;
  categoryRef: DocumentReference;
  categoryId?: string;
  imageUrls?: string[];
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
}

export interface ICategory {
  id: string;
  title: string;
  imageUrl: string;
  relatedCategories?: string[];
}
