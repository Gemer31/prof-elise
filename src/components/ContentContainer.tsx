import { ICommonProps } from '@/app/models';

interface IContentContainer extends ICommonProps {
  id?: string;
}

export function ContentContainer({children, styleClass, id}: IContentContainer) {
  return (
    <article id={id || ''} className={'w-full max-w-screen-xl px-2 ' + (styleClass || '')}>
      {children}
    </article>
  )
}