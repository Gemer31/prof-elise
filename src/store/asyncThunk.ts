import { createAsyncThunk } from '@reduxjs/toolkit';
import { AddPrefixToKeys, doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { IClient } from '@/store/dataSlice';

export const getClient = createAsyncThunk( // todo think if no such clientId
  'client/get',
  async (clientId: string): Promise<IClient> => {
    const client = await getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId));
    return client.data();
  }
);
export const updateClient = createAsyncThunk(
  'client/update',
  async ({clientId, data}: { clientId: string; data: IClient }): Promise<IClient> => {
    await setDoc(
      doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId),
      data as AddPrefixToKeys<string, any>,
    );
    return data;
  }
);
