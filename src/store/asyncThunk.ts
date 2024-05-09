import { createAsyncThunk } from '@reduxjs/toolkit';
import { IProduct } from '@/app/models';
import { AddPrefixToKeys, collection, doc, getDoc, updateDoc, query } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirebaseCollections } from '@/app/enums';
import { IClient } from '@/store/dataSlice';

export interface IFetchFavourites {
  clientId: string;
  data: Record<string, IProduct>;
}

export const getClient = createAsyncThunk(
  'client/get',
  async (clientId: string): Promise<IClient> => {
    const productsV2Pr = await getDoc(doc(db, 'app', FirebaseCollections.CLIENT));
    return productsV2Pr.get(clientId);
  }
);
export const updateClient = createAsyncThunk(
  'client/update',
  async (data: { [key: string]: IClient }): Promise<IClient> => {
    await updateDoc(
      doc(db, String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_NAME), FirebaseCollections.CLIENT),
      data as AddPrefixToKeys<string, any>,
    );
    const clientId: string = Object.keys(data)[0];
    return data[clientId];
  }
);
