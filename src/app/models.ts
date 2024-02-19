export interface IProduct {
  id: string;
  title: string;
  price: string;
  description: string;
  categoryId: string;
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

export interface ICart {
  totalProductsPrice: string;
  totalProductsAmount: number;
  products: Record<string, ICartProductData>;
}

export interface ICartProductData {
  data: IProduct;
  amount: number;
}

export interface IFirebaseDocumentModel {
  _document: {
    data: {
      value: {
        mapValue: {
          fields: IFirestoreFields;
        }
      }
    };
    key: {
      path: {
        segments: string[];
      }
    }
  };
}

export interface IFirestoreFields {
  stringValue?: string;
  numberValue?: number;
  data?: {
    arrayValue?: {
      values?: {
        mapValue: {
          fields: IFirestoreFields
        }
      }[];
    }
  };
}

export interface IFirestoreConfigEditorInfo {
  nextOrderNumber: {
    integerValue: string;
  };
  contactPhone: {
    stringValue: string;
  };
  workingHours: {
    stringValue: string;
  };
  currency: {
    stringValue: string;
  };
  shopDescription: {
    stringValue: string;
  };
  deliveryDescription: {
    stringValue: string;
  };
}

export interface IFirestoreCategoriesEditorInfo {
  id: {
    stringValue: string;
  };
  title: {
    stringValue: string;
  };
  imageUrl: {
    stringValue: string;
  };
}

export interface IFirestoreProductsEditorInfo {
  id: {
    stringValue: string;
  };
  title: {
    stringValue: string;
  };
  price: {
    stringValue: string;
  };
  description: {
    stringValue: string;
  };
  categoryId: {
    stringValue: string;
  };
  imageUrls: {
    arrayValue: {
      values: {
        stringValue: string;
      }[];
    };
  };
}
