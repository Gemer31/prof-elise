import { ColorOptions, OrderByKeys, OrderStatuses, RouterPath } from '@/app/enums';

export const FADE_IN_RIGHT_CLASS = 'animate__animated animate__fadeInRight';
export const FADE_IN_LEFT_CLASS = 'animate__animated animate__fadeInLeft';
export const FADE_IN_UP_CLASS = 'animate__animated animate__fadeInUp';
export const FADE_OUT_RIGHT_CLASS = 'animate__animated animate__fadeOutRight';
export const FADE_OUT_LEFT_CLASS = 'animate__animated animate__fadeOutLeft';
export const FADE_IN_CLASS = 'animate__animated animate__fadeIn';
export const FADE_OUT_CLASS = 'animate__animated animate__fadeOut';

export const CTRL_CODE: number = 17;

export const CLIENT_ID: string = 'clientId';

// Change carefully, first
export const COLOR_OPTION_VALUES = new Map<ColorOptions, string>([
  [ColorOptions.PINK, 'bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white'],
  [ColorOptions.GRAY, 'bg-slate-100 hover:bg-slate-400 active:bg-slate-600 text-black']
]);

export const ORDER_BY_FIELDS = new Map<OrderByKeys, string>([
  [OrderByKeys.BY_PRICE, 'price'],
  [OrderByKeys.BY_ALFABET, 'title'],
  [OrderByKeys.BY_DATE, 'createDate']
]);

export const SITE_HEADER_LINKS: string[][] = [
  [RouterPath.HOME, 'main'],
  [RouterPath.CATEGORIES, 'catalog'],
  [RouterPath.DELIVERY, 'delivery'],
  [RouterPath.CONTACTS, 'contacts']
];

export const ORDER_STATUS_CLASSES = new Map([
  [OrderStatuses.CREATED, 'p-2 px-4 rounded-md bg-yellow-300'],
  [OrderStatuses.COMPLETED, 'p-2 px-4 rounded-md bg-emerald-600 text-white'],
  [OrderStatuses.CANCELLED, 'p-2 px-4 rounded-md bg-gray-400'],
])