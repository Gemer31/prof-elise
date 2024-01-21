import { Category } from '@/app/models';

export const FADE_IN_RIGHT_CLASS = 'animate__animated animate__fadeInRight';
export const FADE_IN_LEFT_CLASS = 'animate__animated animate__fadeInLeft';
export const FADE_IN_UP_CLASS = 'animate__animated animate__fadeInUp';
export const FADE_OUT_RIGHT_CLASS = 'animate__animated animate__fadeOutRight';
export const FADE_OUT_LEFT_CLASS = 'animate__animated animate__fadeOutLeft';
export const FADE_IN_CLASS = 'animate__animated animate__fadeIn';
export const FADE_OUT_CLASS = 'animate__animated animate__fadeOut';

export const CONTACT_PHONE: string = "+375 29 299 29 29"
export const LOCALE: string = 'ru';

export const TRANSLATES: Record<string, Record<string, string>> = {
  ru: {
    сonsumables: 'Расходные материалы',
    сonsumablesWholesaleRetail: 'Расходные материалы оптом и в розницу',
    aboutUsDescription: 'Наша компания работает более 4 лет, чтобы обеспечить предприятия красоты, парикмахерские, медучреждения и предприятия здоровья качественными, отечественными расходными материалами. Мы стали партнерами для лучших и успешных компаний.',
    main: 'Главная',
    delivery: 'Доставка',
    contacts: 'Контакты',
    requestCall: 'Заказать звонок',
    send: 'Отправить',
    yourName: 'Ваше имя',
    phone: 'Телефона',
    search: 'Поиск',
    requestCallSended: 'Наши операторы свяжутся с вами',
    advantages: 'Преимущества',
    deliveryAdvantage: 'Бесплатная доставка по Могилеву при заказе от 80р'
  }
}

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Масло для массажа',
    image: 'icon/instagram.svg',
    navigationPage: 'oil-for-massage'
  },
  {
    id: '2',
    name: 'Для парикмахерских',
    image: 'icon/instagram.svg',
    navigationPage: 'oil-for-massage',
    categories: [
      {
        id: '3',
        name: 'Воротнички',
        image: 'icon/instagram.svg',
        navigationPage: 'oil-for-massage'
      },
      {
        id: '4',
        name: 'Пеньюары',
        image: 'icon/instagram.svg',
        navigationPage: 'oil-for-massage'
      }
    ]
  }
]