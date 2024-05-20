import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getClient, updateClient } from '@/store/asyncThunk';
import { ICartProductModel, IClient, IPopupData } from '@/app/models';

interface IDataSlice {
  popupData: IPopupData;
  notificationMessage: string;
  cartLoading: boolean;
  cartTotal: number;
  client: IClient;
}

export const dataSlice = createSlice({
  name: 'dataSlice',
  initialState: {
    popupData: null,
    notificationMessage: null,
    cartLoading: true,
    cartTotal: 0,
    client: null
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
      state.cartLoading = false;
    });
  },
  reducers: {
    setPopupData: (state: IDataSlice, action: PayloadAction<IPopupData>) => {
      state.popupData = action.payload;
    },
    setNotificationMessage: (state: IDataSlice, action: PayloadAction<string>) => {
      state.notificationMessage = action.payload;
    }
  }
});

export const {
  setPopupData,
  setNotificationMessage
} = dataSlice.actions;