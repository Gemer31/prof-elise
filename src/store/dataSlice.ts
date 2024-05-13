import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getClient, updateClient } from '@/store/asyncThunk';
import { DocumentReference } from '@firebase/firestore';

export interface ICartProductModel {
  count: number;
  productRef: DocumentReference;
}

export interface IViewedRecentlyModel {
  time: number;
  productRef: DocumentReference;
}

export interface IClient {
  cart?: Record<string, ICartProductModel>;
  favourites?: Record<string, DocumentReference>;
  viewedRecently?: Record<string, IViewedRecentlyModel>;
}

interface IDataSlice {
  requestCallPopupVisible: boolean;
  notificationMessage: string;
  cartLoading: boolean;
  cartTotal: number;
  client: IClient;
}

export const dataSlice = createSlice({
  name: 'dataSlice',
  initialState: {
    requestCallPopupVisible: false,
    notificationMessage: null,
    cartLoading: true,
    cartTotal: 0,
    client: {}
  },
  extraReducers: (builder) => {
    builder.addMatcher(getClient.settled, (state: IDataSlice, action) => {
      const newClient = action.payload as IClient;

      state.cartTotal = 0;
      newClient?.cart && Object.values(newClient.cart).forEach((item: ICartProductModel) => {
        state.cartTotal += item.count;
      });

      state.client = newClient;
      state.cartLoading = false;
    });
    builder.addMatcher(updateClient.settled, (state: IDataSlice, action) => {
      const newClient = action.payload as IClient;

      state.cartTotal = 0;
      newClient?.cart && Object.values(newClient.cart).forEach((item: ICartProductModel) => {
        state.cartTotal += item.count;
      });

      state.client = newClient;
    });
  },
  reducers: {
    setRequestCallPopupVisible: (state: IDataSlice, action: PayloadAction<boolean>) => {
      state.requestCallPopupVisible = action.payload;
    },
    setNotificationMessage: (state: IDataSlice, action: PayloadAction<string>) => {
      state.notificationMessage = action.payload;
    }
  }
});

export const {
  setRequestCallPopupVisible,
  setNotificationMessage
} = dataSlice.actions;