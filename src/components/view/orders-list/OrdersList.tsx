import { PaginateWrapper } from '@/components/ui/paginate-wrapper/PaginateWrapper';
import { IOrder, IOrderByModel, IUser } from '@/app/models';
import { OrderCard } from '@/components/view/orders-list/OrderCard';
import { OrderByKeys, PaginateItemsPosition, RouterPath } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/translates';

interface IOrdersListProps {
  data: IOrder<IUser>[];
  orderByParams?: IOrderByModel;
  pagesCount: number;
  pageLimit: number;
  page: number;
}

export function OrdersList({data, page, pageLimit, pagesCount, orderByParams}: IOrdersListProps) {
  return <PaginateWrapper
    orderByAvailableParams={{
      [OrderByKeys.BY_DATE]: true
    }}
    itemsPosition={PaginateItemsPosition.LINE}
    items={data}
    emptyListText={TRANSLATES[LOCALE].ordersListIsEmpty}
    page={page}
    pageLimit={pageLimit}
    pagesCount={pagesCount}
    baseRedirectUrl={RouterPath.ORDERS}
    orderByParams={orderByParams}
  >
    {data?.map((item) => {
      return <OrderCard key={item.id} data={item}/>;
    })}
  </PaginateWrapper>;
}