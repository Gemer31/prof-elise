import { PaginateWrapper } from '@/components/ui/paginate-wrapper/PaginateWrapper';
import { IOrderSerialized, IPaginateProps } from '@/app/models';
import { OrderCard } from '@/components/view/orders-list/OrderCard';
import { OrderByKeys, PaginateItemsPosition } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface IOrdersListProps {
  data: IOrderSerialized[];
  paginateProps: IPaginateProps;
}

export function OrdersList(
  {
    data,
    paginateProps,
  }: IOrdersListProps,
) {
  return (
    <PaginateWrapper
      orderByAvailableParams={{
        [OrderByKeys.BY_DATE]: true,
      }}
      paginateProps={paginateProps}
      itemsPosition={PaginateItemsPosition.LINE}
      items={data}
      emptyListText={TRANSLATES[LOCALE].ordersListIsEmpty}
    >
      {data?.map((item) => <OrderCard key={item.id} data={item}/>)}
    </PaginateWrapper>
  );
}
