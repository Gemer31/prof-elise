export enum ButtonTypes {
  BUTTON = 'button',
  SUBMIT = 'submit'
}

export enum UrlQueryParamsNames {
  PAGE = 'page',
  PAGE_LIMIT = 'pageLimit',
  SORT_BY = 'sortBy',
  BY_PRICE = 'byPrice',
  BY_DATE = 'byDate',
  BY_ALFABET = 'byAlfabet',
  MIN_PRICE = 'minPrice',
  MAX_PRICE = 'maxPrice',
  SEARCH_VALUE = 'q',
}

export enum ColorOptions {
  PINK = 'pink',
  GRAY = 'gray',
}

export enum RouterPath {
  HOME = '/',
  DELIVERY = '/delivery',
  CONTACTS = '/contacts',
  LOGIN = '/login',
  EDITOR = '/editor',
  CATEGORIES = '/categories',
  PRODUCTS = '/products',
  CART = '/cart',
  CHECKOUT = '/checkout',
  FAVOURITES = '/favourites',
  SEARCH = '/search'
}

export enum EditGroup {
  GENERAL = 'general',
  CATEGORIES = 'categories',
  PRODUCTS = 'products',
  IMAGES = 'images',
}

export enum FirestoreCollections {
  STATE = 'state',
  SETTINGS = 'settings',
  CATEGORIES = 'categories',
  PRODUCTS = 'products',
  ANONYMOUS_CLIENTS = 'anonymousClients',
}

export enum FirestoreDocuments {
  CONFIG = 'config'
}

export enum PageLimits {
  SIX = '6',
  TWELVE = '12',
}

export enum OrderByKeys {
  BY_PRICE = 'byPrice',
  BY_DATE = 'byDate',
  BY_ALFABET = 'byAlfabet',
}

export enum PopupTypes {
  REQUEST_CALL,
  BUY_IN_ONE_CLICK,
}