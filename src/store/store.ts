import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { store } from 'next/dist/build/output/store';
import { Provider, useRef } from 'react';
import { dataSlice } from '@/store/dataSlice';

const rootReducer = combineReducers({});

export const makeStore = () => {
  return configureStore({
    reducer: {
      dataReducer: dataSlice.reducer
    }
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

