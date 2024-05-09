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
  CATEGORIES = 'categories',
  CATEGORIES_V2 = 'categoriesV2',
  CONFIG = 'config',
  PRODUCTS = 'products',
  PRODUCTS_V2 = 'productsV2',
  CLIENT = 'client',
}

export enum CounterType {
  DEFAULT,
  SMART,
}