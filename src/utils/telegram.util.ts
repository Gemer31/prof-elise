import { ICart, IConfig, IFirestoreConfigEditorInfo } from '@/app/models';

export function getOrderMessage(data: {
  orderNumber: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  comment?: string;
  cart: ICart;
  config: IConfig;
}): string {
  let message: string = `Заказ №${data.orderNumber}`
    + '\n\n'
    + `Имя:${data.name}`
    + '\n'
    + `Телефон:${data.phone}`
    + '\n'
    + `E-mail:${data.email}`
    + '\n'
    + `Адрес:${data.address}`
    + '\n'
    + data.comment ? `Комментарий:${data.comment}\n` : ''
    + `Сумма:${data.cart.totalProductsPrice} ${data.config.currency}`
    + '\n';

  Object.values(data.cart.products).forEach((product) => {
    message += `\n-${product.data.title} | ${product.data.price} ${data.config.currency} за шт. | ${product.amount} шт.`
  });

  return message;
}