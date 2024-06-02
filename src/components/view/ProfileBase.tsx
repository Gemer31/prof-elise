import { ICommonProps } from '@/app/models';
import { SubHeader } from '@/components/view/SubHeader';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { Breadcrumbs } from '@/components/view/Breadcrumbs';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { Button } from '@/components/ui/Button';
import { ColorOptions, RouterPath } from '@/app/enums';

const PROFILE_TABS = [
  {
    title: TRANSLATES[LOCALE].mainInfo,
    href: RouterPath.PROFILE
  },
  {
    title: TRANSLATES[LOCALE].orders,
    href: RouterPath.ORDERS
  },
  {
    title: TRANSLATES[LOCALE].editor,
    href: RouterPath.EDITOR
  },
]

interface IProfileBaseProps extends ICommonProps{
  activeRoute: RouterPath;
}

export function ProfileBase({children, activeRoute}: IProfileBaseProps) {
  return <>
    <SubHeader/>
    <ContentContainer styleClass="flex flex-col items-center px-2">
      <Breadcrumbs links={[{title: TRANSLATES[LOCALE].privateAccount}]}/>
      <h1 className="w-full text-2xl font-medium py-2">{TRANSLATES[LOCALE].privateAccount}</h1>
      <section className="w-full flex justify-between">
        <div className="flex gap-x-4">
          {
            PROFILE_TABS.map(item => {
              return <Button
                key={item.title}
                color={activeRoute === item.href ? ColorOptions.PINK : ColorOptions.GRAY}
                styleClass="flex px-4 py-2"
                href={item.href}
              >{item.title}</Button>
            })
          }
        </div>
        <Button
          color={ColorOptions.GRAY}
          styleClass="flex px-4 py-2"
          href={RouterPath.ORDERS}
        >{TRANSLATES[LOCALE].exit}</Button>
      </section>
      <article className="w-full my-4">
        {children}
      </article>
    </ContentContainer>
  </>;
}