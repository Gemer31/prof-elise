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
    name: string;
    image: string;
    categories?: Category[];
}

export interface IFirebaseDocumentModel {
    _document: {
        data: {
            value: {
                mapValue: {
                    fields: {
                        [key: string]: FirebaseCollectionFieldModel;
                    }
                }
            }
        };
        key: {
            path: {
                segments: string[];
            }
        }
    }
}

export type FirebaseCollectionFieldModel = { stringValue: string };