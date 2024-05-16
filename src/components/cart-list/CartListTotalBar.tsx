import { IConfig } from '@/app/models';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/Button';
import { ButtonTypes } from '@/app/enums';

interface ICartListTotalBarProps {
  config: IConfig;
}

export function CartListTotalBar({config}: ICartListTotalBarProps) {
  return <section className="h-fit bg-slate-100 rounded-md">
    <div className="w-full p-4 separator">
      <Button
        styleClass="w-full py-2"
        type={ButtonTypes.BUTTON}>
        {TRANSLATES[LOCALE].gotoCreateOrder}
      </Button>
      <div className="py-2 text-center text-xs">{TRANSLATES[LOCALE].createOrderHint}</div>
    </div>
    <div className="flex justify-between p-4 text-lg">
      <span>{TRANSLATES[LOCALE].result}:</span>
      <span>{100} {config.currency}</span>
    </div>
  </section>
}