import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getClient, updateClient } from '@/store/asyncThunk';
import { ICartProductModel, IClient } from '@/app/models';


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