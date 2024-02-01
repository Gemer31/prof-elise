export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
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