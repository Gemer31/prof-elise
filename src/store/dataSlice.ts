import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, ICartProductData, IProduct } from '@/app/models';

interface IDataSlice {
  requestCallPopupVisible: boolean;
  notificationMessage: string | null;
  cart: ICart;
}

export const dataSlice = createSlice({
  name: 'dataSlice',
  initialState: {
    requestCallPopupVisible: false,
    notificationMessage: null,
    cart: {
      totalProductsPrice: 0,
      totalProductsAmount: 0,
      products: {}
    }
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

      state.cart.products[action.payload.data.id] = cartProductData
        ? {
          ...cartProductData,
          amount: action.payload.addToExist ? (cartProductData.amount + action.payload.amount) : action.payload.amount
        }
        : action.payload;

      const products = Object.values(state.cart.products);
      products.forEach(({data, amount}) => totalProductsPrice += (amount * data.price));
      state.cart.totalProductsPrice = totalProductsPrice;
      state.cart.totalProductsAmount = products.length;

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeProductFromCart: (state: IDataSlice, action: PayloadAction<string>) => {
      const cartProductData: ICartProductData = state.cart.products[action.payload];
      if (cartProductData) {
        state.cart.totalProductsPrice -= (cartProductData.amount * cartProductData.data.price);
        delete state.cart.products[action.payload];
        state.cart.totalProductsAmount = Object.keys(state.cart.products).length;
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    setCartData: (state: IDataSlice, action: PayloadAction<ICart>) => {
      state.cart = action.payload;
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