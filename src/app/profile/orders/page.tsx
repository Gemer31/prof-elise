import { SubHeader } from '@/components/view/SubHeader';
import { ProfileBase } from '@/components/view/ProfileBase';
import { RouterPath } from '@/app/enums';

export default async function OrdersPage() {

  return <>
    <ProfileBase activeRoute={RouterPath.ORDERS}>
      <div>
        orders
      </div>
    </ProfileBase>
  </>;
}