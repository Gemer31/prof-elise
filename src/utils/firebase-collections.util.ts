import { IFirebaseDocumentModel } from '@/app/models';
import { QueryDocumentSnapshot } from '@firebase/firestore';

export function getDocData<T>(docs: Array<QueryDocumentSnapshot>  | undefined, docName: string): T {
  const typedDocs: IFirebaseDocumentModel[] = docs as unknown as IFirebaseDocumentModel[];
  const doc: IFirebaseDocumentModel | undefined = typedDocs
    ?.find((doc) => doc._document.key.path.segments.at(-1) === docName);

  return doc?._document.data.value.mapValue.fields as T;
}