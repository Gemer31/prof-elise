import { ICartProductModel, IConfig, IProduct } from '@/app/models';
import currency from 'currency.js';
import { transformPhoneUtil } from '@/utils/transform-phone.util';

export function getOrderMessage(data: {
  orderNumber?: number;
  name?: string;
  phone?: string;
  email?: string;
  deliveryAddress?: string;
  comment?: string;
  cart: Record<string, ICartProductModel<IProduct>>;
  config: IConfig;
}): string {
  let message: string = `Заказ №${data.orderNumber}`
    + '\n\n'
    + `Имя: ${data.name}`
    + '\n'
    + `Телефон: +${transformPhoneUtil(data.phone)}`
    + '\n'
    + `E-mail: ${data.email}`
    + '\n'
    + `Адрес: ${data.deliveryAddress}`
    + '\n'
    + (data.comment ? `Комментарий: ${data.comment}\n` : '')

  let total: string = '0';
  Object.values(data.cart).forEach((item) => {
    message += `\n- ${item.productRef.title} | ${currency(item.productRef.price).toString()} ${data.config.currency}/шт. | ${item.count} шт.`
    const totalProduct = currency(item.productRef.price).multiply(item.count);
    total = currency(total).add(totalProduct).toString();
  });

  message += `\n\nСумма: ${total} ${data.config.currency}`;

  return message;
}