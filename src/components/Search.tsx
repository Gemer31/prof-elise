import { LOCALE, TRANSLATES } from '@/app/constants';

export function Search() {
  return (
    <form>
      <input className="field-input" placeholder={TRANSLATES[LOCALE].search}/>
    </form>
  )
}