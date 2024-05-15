export enum ButtonTypes {
  BUTTON = 'button',
  SUBMIT = 'submit'
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
  FAVOURITES = '/favourites'
}

export enum EditGroup {
  GENERAL = 'general',
  CATEGORIES = 'categories',
  PRODUCTS = 'products',
  IMAGES = 'images',
}

export enum FirestoreCollections {
  SETTINGS = 'settings',
  CATEGORIES = 'categories',
  PRODUCTS = "products",
  ANONYMOUS_CLIENTS = 'anonymousClients',
}

export enum FirestoreDocuments {
  CONFIG = 'config'
}

export enum CounterType {
  DEFAULT,
  SMART,
}

export enum PageLimits {
  SIX = '6',
  TWELVE = '12',
}

export enum SortValues {
  BY_PRICE = 'byPrice'
}