import { PaginateWrapper } from '@/components/ui/paginate-wrapper/PaginateWrapper';
import { IOrderByModel, IOrderSerialized, IPaginateProps } from '@/app/models';
import { OrderCard } from '@/components/view/orders-list/OrderCard';
import { OrderByKeys, PaginateItemsPosition, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface IOrdersListProps {
  data: IOrderSerialized[];
  paginateProps: IPaginateProps;
}

export function OrdersList({data, paginateProps}: IOrdersListProps) {
  return <PaginateWrapper
    orderByAvailableParams={{
      [OrderByKeys.BY_DATE]: true
    }}
    paginateProps={paginateProps}
    itemsPosition={PaginateItemsPosition.LINE}
    items={data}
    emptyListText={TRANSLATES[LOCALE].ordersListIsEmpty}
  >
    {data?.map((item) => {
      return <OrderCard key={item.id} data={item}/>;
    })}
  </PaginateWrapper>;
}