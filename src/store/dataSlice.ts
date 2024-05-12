import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, ICartProductData, IProduct } from '@/app/models';
import { getClient, updateClient } from '@/store/asyncThunk';
import { DocumentReference } from '@firebase/firestore';

export interface ICartProductModel {
  count: number;
  productRef: DocumentReference;
}

export interface IClient {
  cart?: Record<string, ICartProductModel>;
  favourites?: Record<string, DocumentReference>;
}

interface IDataSlice {
  requestCallPopupVisible: boolean;
  notificationMessage: string;
  cart: ICart;
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
    cart: {
      totalProductsPrice: '0',
      totalProductsAmount: 0,
      products: {}
    },

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
    },
    addProductToCart: (state: IDataSlice, action: PayloadAction<{
      data: IProduct;
      amount: number;
      addToExist?: boolean
    }>) => {
      const cartProductData = state.cart.products[action.payload.data.id];
      let totalProductsPrice: number = 0;
      const prevAmount = state.cart.products[action.payload.data.id]?.amount || 0;

      state.cart.products[action.payload.data.id] = cartProductData
        ? {
          ...cartProductData,
          amount: action.payload.addToExist ? Math.round(cartProductData.amount + action.payload.amount) : action.payload.amount
        }
        : action.payload;

      const products = Object.values(state.cart.products);
      products.forEach(({data, amount}) => totalProductsPrice += (amount * parseFloat(data.price)));
      state.cart.totalProductsPrice = totalProductsPrice.toFixed(2);
      if (action.payload.addToExist) {
        state.cart.totalProductsAmount += action.payload.amount;
      } else {
        state.cart.totalProductsAmount = state.cart.totalProductsAmount - prevAmount + action.payload.amount;
      }
      state.cartLoading = false;

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeProductFromCart: (state: IDataSlice, action: PayloadAction<string>) => {
      const cartProductData: ICartProductData = state.cart.products[action.payload];
      if (cartProductData) {
        state.cart.totalProductsPrice = (parseFloat(state.cart.totalProductsPrice) - (cartProductData.amount * parseFloat(cartProductData.data.price))).toFixed(2);
        delete state.cart.products[action.payload];
        state.cart.totalProductsAmount -= cartProductData.amount;
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    setCartData: (state: IDataSlice, action: PayloadAction<ICart>) => {
      state.cart = action.payload;
      state.cartLoading = false;
      localStorage.setItem('cart', JSON.stringify(state.cart));
    }
  }
});

export const {
  setRequestCallPopupVisible,
  setNotificationMessage,
  addProductToCart,
  removeProductFromCart,
  setCartData
} = dataSlice.actions;