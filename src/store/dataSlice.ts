import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, ICartProductData, IProduct } from '@/app/models';
import { getClient, updateClient } from '@/store/asyncThunk';

export interface IClient {
  cart?: ICart;
  favourites?: Record<string, IProduct>;
}

interface IDataSlice {
  requestCallPopupVisible: boolean;
  notificationMessage: string | null;
  cart: ICart;
  cartLoading: boolean;
  favourites: Record<string, IProduct>;
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
    favourites: {},
    client: {}
  },
  extraReducers: (builder) => {
    builder.addMatcher(getClient.settled, (state, action) => {
      state.client = action.payload as IClient;
    });
    builder.addMatcher(updateClient.settled, (state, action) => {
      state.client = action.payload as IClient;
    });
  },
  reducers: {
    setRequestCallPopupVisible: (state: IDataSlice, action: PayloadAction<boolean>) => {
      state.requestCallPopupVisible = action.payload;
    },
    setNotificationMessage: (state: IDataSlice, action: PayloadAction<string | null>) => {
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
    },
    changeFavourites: (state: IDataSlice, action: PayloadAction<IProduct>) => {
      if (state.favourites[action.payload.id]) {
        delete state.favourites[action.payload.id];
      } else {
        state.favourites[action.payload.id] = action.payload;
      }
      localStorage.setItem('favourites', JSON.stringify(state.favourites));
    },
    setFavouritesData: (state: IDataSlice, action: PayloadAction<Record<string, IProduct>>) => {
      state.favourites = action.payload;
      state.cartLoading = false;
      localStorage.setItem('favourites', JSON.stringify(state.favourites));
    }
  }
});

export const {
  setRequestCallPopupVisible,
  setNotificationMessage,
  addProductToCart,
  removeProductFromCart,
  setCartData,
  setFavouritesData,
  changeFavourites
} = dataSlice.actions;