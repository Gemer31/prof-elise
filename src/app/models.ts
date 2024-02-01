export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrls?: string[];
  categoryId?: string;
}

export interface CommonProps {
  children: React.ReactNode,
  styleClass?: string;
}

export interface Category {
  id: string;
  title: string;
  imageUrl: string;
  categories?: Category[];
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
  shopDescription: {
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
    numberValue: string;
  };
  categoryId: {
    stringValue: string;
  };
}