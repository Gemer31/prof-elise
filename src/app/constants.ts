import { Category, Product } from '@/app/models';

export const FADE_IN_RIGHT_CLASS = 'animate__animated animate__fadeInRight';
export const FADE_IN_LEFT_CLASS = 'animate__animated animate__fadeInLeft';
export const FADE_IN_UP_CLASS = 'animate__animated animate__fadeInUp';
export const FADE_OUT_RIGHT_CLASS = 'animate__animated animate__fadeOutRight';
export const FADE_OUT_LEFT_CLASS = 'animate__animated animate__fadeOutLeft';
export const FADE_IN_CLASS = 'animate__animated animate__fadeIn';
export const FADE_OUT_CLASS = 'animate__animated animate__fadeOut';

export const CTRL_CODE = 17;
export const CONTACT_PHONE: string = '+375 44 532 54 20';
export const WORKING_TIME: string = 'пн-сб 9:00-19:00';
export const CURRENCY: string = 'бел.руб';
export const FIREBASE_DATABASE_NAME = 'app';

export const PRODUCTS_BY_CATEGORY_ID: Record<string, Product[]> = {
  '1': [
    {
      id: 'p-1',
      name: 'ВОРОТНИЧКИ БУМАЖНЫЕ НА ЛИПУЧКЕ "ЧИСТОВЬЕ" (5*100 ШТ)',
      price: 14,
      image: '/images/vorotnichki.png',
      categoryId: '1'
    }
  ]
};

export const PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'ВОРОТНИЧКИ БУМАЖНЫЕ НА ЛИПУЧКЕ "ЧИСТОВЬЕ" (5*100 ШТ)',
    price: 14,
    image: '/images/vorotnichki.png',
    categoryId: '1'
  }
];

export const CATEGORIES: Category[] = [
  {
    id: '1',
    title: 'Масло для массажа',
    imageUrl: '/icons/instagram.svg'
  },
  {
    id: '2',
    title: 'Для парикмахерских',
    imageUrl: '/icons/instagram.svg',
    categories: [
      {
        id: '3',
        title: 'Воротнички',
        imageUrl: '/icons/instagram.svg'
      },
      {
        id: '4',
        title: 'Пеньюары',
        imageUrl: '/icons/instagram.svg'
      }
    ]
  }
];

// О нас и преимущества:
//   Снизу про доставку: оформить заказ можно с 9 до 19часов. Наш менеджер может предоставить вам всю необходимую информацию по товарам, которые вас заинтересуют.
//   Доставка осуществляется каждый день, кроме воскресенья.