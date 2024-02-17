import {
  ICategory,
  IConfig,
  IFirebaseDocumentModel,
  IFirestoreCategoriesEditorInfo,
  IFirestoreConfigEditorInfo,
  IFirestoreFields,
  IFirestoreProductsEditorInfo,
  IProduct
} from '@/app/models';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';

export function getDocData<T>(docs: Array<QueryDocumentSnapshot> | undefined, docName: string): T {
  const typedDocs: IFirebaseDocumentModel[] = docs as unknown as IFirebaseDocumentModel[];
  const doc: IFirebaseDocumentModel | undefined = typedDocs
    ?.find((doc) => doc._document.key.path.segments.at(-1) === docName);

  return doc?._document.data?.value.mapValue.fields as T;
}

export function getStorageImageSrc(image: StorageReference | undefined): string {
  return image ? `https://firebasestorage.googleapis.com/v0/b/${image.bucket}/o/${image.fullPath}?alt=media` : '';
}

export function convertConfigDataToModel(data: IFirestoreConfigEditorInfo): IConfig {
  return {
    nextOrderNumber: Number(data?.nextOrderNumber?.integerValue),
    contactPhone: data?.contactPhone?.stringValue,
    currency: data?.currency?.stringValue,
    workingHours: data?.workingHours?.stringValue,
    shopDescription: data?.shopDescription?.stringValue,
    deliveryDescription: data?.deliveryDescription?.stringValue,
  };
}

export function convertCategoriesDataToModelArray(data: IFirestoreFields): ICategory[] {
  return data?.data?.arrayValue?.values?.map((item) => {
    const category: {
      mapValue: {
        fields: IFirestoreCategoriesEditorInfo;
      }
    } = item as {
      mapValue: {
        fields: IFirestoreCategoriesEditorInfo;
      }
    };

    return {
      id: category.mapValue.fields.id.stringValue,
      title: category.mapValue.fields.title.stringValue,
      imageUrl: category.mapValue.fields.imageUrl.stringValue
      // subcategories:
    };
  }) || [];
}

export function convertProductsDataToModelArray(data: IFirestoreFields): IProduct[] {
  return data?.data?.arrayValue?.values?.map((item) => {
    const product: {
      mapValue: {
        fields: IFirestoreProductsEditorInfo;
      }
    } = item as {
      mapValue: {
        fields: IFirestoreProductsEditorInfo;
      }
    };

    return {
      id: product.mapValue.fields.id.stringValue,
      title: product.mapValue.fields.title.stringValue,
      price: Number(product.mapValue.fields.price.integerValue || product.mapValue.fields.price.doubleValue),
      description: product.mapValue.fields.description.stringValue,
      categoryId: product.mapValue.fields.categoryId.stringValue,
      imageUrls: product.mapValue.fields.imageUrls.arrayValue.values.map((v) => (v.stringValue))
    };
  }) || [];
}

export function converImageUrlsToGallery(imgs: string[]): { original: string }[] {
  return imgs.map((imgUrl) => ({
    original: imgUrl,
  }));
}