import { ICommonProps } from '@/app/models';

interface IContentContainer extends ICommonProps {
  id?: string;
  type?: 'div' | 'article';
}

export function ContentContainer({children, styleClass, id, type}: IContentContainer) {
  return type === 'article'
    ? <article id={id || ''} className={'w-full max-w-screen-xl px-2 ' + (styleClass || '')}>{children}</article>
    : <div id={id || ''} className={'w-full max-w-screen-xl px-2 ' + (styleClass || '')}>{children}</div>
}