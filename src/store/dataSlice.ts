import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IDataSlice {
  requestCallPopupVisible: boolean;
  notificationMessage: string | null;
}

export const dataSlice = createSlice({
  name: 'dataSlice',
  initialState: {
    requestCallPopupVisible: false,
    notificationMessage: null,
  },
  reducers: {
    setRequestCallPopupVisible: (state: IDataSlice, action: PayloadAction<boolean>) => {
      state.requestCallPopupVisible = action.payload;
    },
    setNotificationMessage: (state: IDataSlice, action: PayloadAction<string | null>) => {
      state.notificationMessage = action.payload;
    }
  }
});

export const {
  setRequestCallPopupVisible,
  setNotificationMessage,
} = dataSlice.actions;