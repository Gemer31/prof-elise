import { PaginateWrapper } from '@/components/ui/paginate-wrapper/PaginateWrapper';
import { IOrder } from '@/app/models';
import { OrderCard } from '@/components/view/orders-list/OrderCard';
import { getPaginateUrl } from '@/utils/router.util';
import { PaginateItemsPosition, RouterPath } from '@/app/enums';

interface IOrdersListProps {
  data: IOrder[];
  pagesCount: number;
  pageLimit: number;
  page: number;
}

export function OrdersList({data, page, pageLimit, pagesCount}: IOrdersListProps) {
  return <PaginateWrapper
    itemsPosition={PaginateItemsPosition.LINE}
    items={data}
    page={page}
    pageLimit={pageLimit}
    pagesCount={pagesCount}
    baseRedirectUrl={getPaginateUrl({
      baseUrl: RouterPath.ORDERS,
      pageLimit,
      page
    })}
  >
    {data?.map((item) => {
      return <OrderCard key={item.id} data={item}/>;
    })}
  </PaginateWrapper>
}