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
  SIGN_IN = '/sighIn',
  REGISTRATION = '/registration',
  FORGOT_PASSWORD = '/forgot',
  CATEGORIES = '/categories',
  PRODUCTS = '/products',
  CART = '/cart',
  CHECKOUT = '/checkout',
  FAVOURITES = '/favourites',
  SEARCH = '/search',
  PROFILE = '/profile',
  ORDERS = '/profile/orders',
  EDITOR = '/profile/editor',
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
  USERS = 'users',
  ORDERS = 'orders',
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

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user'
}

export enum OrderStatuses {
  CREATED = 'created',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaginateItemsPosition {
  LINE = 'line',
  GRID = 'grid',
}