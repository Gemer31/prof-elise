import { IFirebaseDocumentModel } from '@/app/models';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { StorageReference } from '@firebase/storage';

export function getDocData<T>(docs: Array<QueryDocumentSnapshot>, docName: string): T {
  const typedDocs: IFirebaseDocumentModel[] = docs as unknown as IFirebaseDocumentModel[];
  const doc: IFirebaseDocumentModel = typedDocs
    ?.find((doc) => doc._document.key.path.segments.at(-1) === docName);

  return doc?._document.data?.value.mapValue.fields as T;
}

export function getStorageImageSrc(image: StorageReference): string {
  return image ? `https://firebasestorage.googleapis.com/v0/b/${image.bucket}/o/${image.fullPath}?alt=media` : '';
}

export function converImageUrlsToGallery(imgs: string[]): { original: string }[] {
  return imgs.map((imgUrl) => ({
    original: imgUrl,
  }));
}