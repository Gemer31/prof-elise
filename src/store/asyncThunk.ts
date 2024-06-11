import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, DocumentReference, getDoc, setDoc } from '@firebase/firestore';
import { db } from '@/app/lib/firebase-config';
import { FirestoreCollections } from '@/app/enums';
import { ICartProductModel, IInitStore, IViewedRecentlyModel } from '@/app/models';
import { uuidv4 } from '@firebase/util';
import { CLIENT_ID } from '@/app/constants';
import { getClientId } from '@/utils/cookies.util';
import { SerializationUtil } from '@/utils/serialization.util';

export const initStore = createAsyncThunk( // todo think if no such clientId
  'store/init',
  async (): Promise<IInitStore> => {
    let clientId: string = getClientId();
    let cart: Record<string, ICartProductModel<string>>;
    let favourites: Record<string, string>;
    let viewedRecently: Record<string, IViewedRecentlyModel<string>>;

    const createClient = async (): Promise<void> => {
      clientId = uuidv4();
      document.cookie = `${CLIENT_ID}=${clientId};path=/`;

      const [
        newCart,
        newFavourites,
        newViewedRecently
      ] = await Promise.all([
        setCart(clientId),
        setFavourites(clientId),
        setViewedRecently(clientId)
      ]);
      cart = newCart;
      favourites = newFavourites;
      viewedRecently = newViewedRecently;
    };

    if (clientId?.length) {
      const cartRes = await getDoc(doc(db, FirestoreCollections.CART, clientId));
      const existingCart: Record<string, ICartProductModel> = cartRes.data();

      if (existingCart) {
        const [existingFavourites, existingViewedRecently] = await Promise.all([
          getDoc(doc(db, FirestoreCollections.FAVOURITES, clientId)),
          getDoc(doc(db, FirestoreCollections.VIEWED_RECENTLY, clientId))
        ]);
        cart = SerializationUtil.getSerializedCart(existingCart);
        favourites = SerializationUtil.getSerializedFavourites(existingFavourites.data());
        viewedRecently = SerializationUtil.getSerializedViewedRecently(existingViewedRecently.data());
      } else {
        await createClient();
      }
    } else {
      await createClient();
    }

    return {cart, favourites, viewedRecently};
  }
);

export const updateCart = createAsyncThunk(
  'cart/update',
  async ({clientId, data}: {
    clientId?: string;
    data?: Record<string, ICartProductModel>
  }): Promise<Record<string, ICartProductModel<string>>> => await setCart(clientId, data)
);
export const updateFavourites = createAsyncThunk(
  'favourites/update',
  async ({clientId, data}: {
    clientId?: string;
    data?: Record<string, DocumentReference>
  }): Promise<Record<string, string>> => await setFavourites(clientId, data)
);
export const updateViewedRecently = createAsyncThunk(
  'viewedRecently/update',
  async ({clientId, data}: {
    clientId?: string;
    data?: Record<string, IViewedRecentlyModel>
  }): Promise<Record<string, IViewedRecentlyModel<string>>> => await setViewedRecently(clientId, data)
);

export async function setCart(
  clientId: string,
  data: Record<string, ICartProductModel> = {}
): Promise<Record<string, ICartProductModel<string>>> {
  await setDoc(doc(db, FirestoreCollections.CART, clientId), data);
  return SerializationUtil.getSerializedCart(data);
}

export async function setFavourites(
  clientId: string,
  data: Record<string, DocumentReference> = {}
): Promise<Record<string, string>> {
  await setDoc(doc(db, FirestoreCollections.FAVOURITES, clientId), data);
  return SerializationUtil.getSerializedFavourites(data);
}

export async function setViewedRecently(
  clientId: string,
  data: Record<string, IViewedRecentlyModel> = {}
): Promise<Record<string, IViewedRecentlyModel<string>>> {
  await setDoc(doc(db, FirestoreCollections.VIEWED_RECENTLY, clientId), data);
  return SerializationUtil.getSerializedViewedRecently(data);
}
