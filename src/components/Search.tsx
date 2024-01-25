import { LOCALE, TRANSLATES } from '@/app/translates';

export function Search() {
  return (
    <form>
      <input className="field-input" placeholder={TRANSLATES[LOCALE].search}/>
    </form>
  )
}