import { createAsyncThunk } from '@reduxjs/toolkit';
import { AddPrefixToKeys, doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { IClient } from '@/app/models';
import { uuidv4 } from '@firebase/util';
import { CLIENT_ID } from '@/app/constants';
import { getClientId } from '@/utils/cookies.util';

export const getClient = createAsyncThunk( // todo think if no such clientId
  'client/get',
  async (): Promise<IClient> => {
    let clientId: string = getClientId();
    let client;

    const createClient = async (): Promise<void> => {
      clientId = uuidv4();
      document.cookie = `${CLIENT_ID}=${clientId};path=/`;
      client = await setClient(clientId);
    };

    if (!clientId?.length) {
      await createClient();
    } else {
      const response = await getDoc(doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId));
      client = response.data();

      if (!client) {
        await createClient();
      }
    }
    return client;
  }
);

export const updateClient = createAsyncThunk(
  'client/update',
  async ({clientId, data}: { clientId?: string; data?: IClient }): Promise<IClient> => {
    return await setClient(clientId, data);
  }
);

export async function setClient(clientId: string, data?: IClient): Promise<IClient> {
  const setData: IClient = data || {
    cart: {},
    favourites: {},
    viewedRecently: {}
  };
  await setDoc(
    doc(db, FirestoreCollections.ANONYMOUS_CLIENTS, clientId),
    setData as AddPrefixToKeys<string, any>
  );
  return setData;
}
