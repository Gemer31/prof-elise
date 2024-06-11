import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initStore, updateCart, updateFavourites, updateViewedRecently } from '@/store/asyncThunk';
import { ICartProductModel, IClient, IInitStore, IPopupData, IViewedRecentlyModel } from '@/app/models';

interface IDataSlice {
  popupData: IPopupData;
  notificationMessage: string;
  cartLoading: boolean;
  cartTotal: number;
  client: IClient;
  cart?: Record<string, ICartProductModel<string>>;
  favourites?: Record<string, string>;
  viewedRecently?: Record<string, IViewedRecentlyModel<string>>;
}

export const dataSlice = createSlice({
  name: 'dataSlice',
  initialState: {
    popupData: null,
    notificationMessage: null,
    cartLoading: true,
    cartTotal: 0,
    client: null,
    cart: {} as Record<string, ICartProductModel<string>>,
    favourites: {} as Record<string, string>,
    viewedRecently: {} as Record<string, IViewedRecentlyModel<string>>
  },
  extraReducers: (builder) => {
    builder.addMatcher(initStore.settled, (state: IDataSlice, action) => {
      const {cart, viewedRecently, favourites} = action.payload as IInitStore;

      state.cartTotal = 0;
      cart && Object.values(cart).forEach((item) => {
        state.cartTotal += item.count;
      });
      state.cart = cart;
      state.favourites = favourites;
      state.viewedRecently = viewedRecently;
      state.cartLoading = false;
    });
    builder.addMatcher(updateCart.settled, (state: IDataSlice, action) => {
      const newCart = action.payload as Record<string, ICartProductModel<string>>;
      state.cartTotal = 0;
      newCart && Object.values(newCart).forEach((item) => {
        state.cartTotal += item.count;
      });
      state.cart = newCart;
    });
    builder.addMatcher(updateFavourites.settled, (state: IDataSlice, action) => {
      state.favourites = action.payload as Record<string, string>;
    });
    builder.addMatcher(updateViewedRecently.settled, (state: IDataSlice, action) => {
      state.viewedRecently = action.payload as Record<string, IViewedRecentlyModel<string>>;
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