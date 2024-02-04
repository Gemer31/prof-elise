import { CommonProps } from '@/app/models';

export function ContentContainer({children, styleClass}: CommonProps) {
  return (
    <article className={'w-full max-w-screen-xl px-2 ' + styleClass}>
      {children}
    </article>
  )
}