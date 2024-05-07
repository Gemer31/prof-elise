import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, ICartProductData, IProduct } from '@/app/models';

interface IDataSlice {
  requestCallPopupVisible: boolean;
  notificationMessage: string | null;
  cart: ICart;
  cartLoading: boolean;
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