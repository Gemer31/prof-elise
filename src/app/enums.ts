export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit'
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

export enum FirebaseCollections {
  SETTINGS = 'settings',
  CATEGORIES = 'categories',
  PRODUCTS = "products",
  CONFIG = 'config',
  ANONYMOUS_CLIENTS = 'anonymousClients',
}

export enum CounterType {
  DEFAULT,
  SMART,
}