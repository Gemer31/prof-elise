import { ICommonProps } from '@/app/models';
import { SubHeader } from '@/components/view/SubHeader';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { ColorOptions, OrderByKeys, PageLimits, RouterPath, UserRoles } from '@/app/enums';
import { getPaginateUrl } from '@/utils/router.util';

const PROFILE_TABS = [
  {
    id: RouterPath.PROFILE,
    title: TRANSLATES[LOCALE].mainInfo,
    href: RouterPath.PROFILE,
  },
  {
    id: RouterPath.ORDERS,
    title: TRANSLATES[LOCALE].orders,
    href: getPaginateUrl({
      baseRedirectUrl: RouterPath.ORDERS,
      page: 1,
      pageLimit: Number(PageLimits.SIX),
      orderByParams: {
        key: OrderByKeys.BY_DATE,
        value: 'desc',
      },
    }),
  },
  {
    id: RouterPath.EDITOR,
    title: TRANSLATES[LOCALE].editor,
    href: RouterPath.EDITOR,
  },
];

interface IProfileBaseProps extends ICommonProps {
  activeRoute: RouterPath;
  userRole: UserRoles;
}

export function ProfileBase({ children, userRole, activeRoute }: IProfileBaseProps) {
  return (
    <>
      <SubHeader/>
      <ContentContainer styleClass="flex flex-col items-center px-2">
        <Breadcrumbs links={[{ title: TRANSLATES[LOCALE].privateAccount }]}/>
        <h1 className="w-full text-2xl font-medium py-2">{TRANSLATES[LOCALE].privateAccount}</h1>
        <section className="w-full flex justify-between">
          <div className="flex gap-x-4">
            {
              PROFILE_TABS.map((item) => (item.href !== RouterPath.EDITOR || (item.href === RouterPath.EDITOR && userRole === UserRoles.ADMIN)
                ? (
                  <Button
                    key={item.title}
                    setLoadingOnClick
                    color={activeRoute === item.id ? ColorOptions.PINK : ColorOptions.GRAY}
                    styleClass={'flex px-4 py-2 ' + (activeRoute === item.id ? 'pointer-events-none' : '')}
                    href={item.href}
                  >
                    {item.title}
                  </Button>
                )
                : <></>))
            }
          </div>
          <Button
            color={ColorOptions.GRAY}
            styleClass="flex px-4 py-2"
            href={RouterPath.ORDERS}
          >
            {TRANSLATES[LOCALE].exit}
          </Button>
        </section>
        <article className="w-full my-4">
          {children}
        </article>
      </ContentContainer>
    </>
  );
}
