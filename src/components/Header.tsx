import Link from 'next/link';
import { Cart } from '@/components/Cart';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { ContentContainer } from '@/components/ContentContainer';
import { Search } from '@/components/Search';
import { CONTACT_PHONE } from '@/app/constants';

export function Header() {
  const navigationLinkClass: string = convertToClass([
    'flex',
    'items-center',
    'px-4',
    'py-2'
  ]);

  return (
    <header className="w-full flex flex-col items-center">
      <div className="w-full flex justify-center bg-pink-300">
        <ContentContainer styleClass="flex justify-between">
          <nav className="flex">
            <Link className={navigationLinkClass} href="/">Главная</Link>
            <Link className={navigationLinkClass} href="/delivery">Доставка</Link>
            <Link className={navigationLinkClass} href="/contacts">Контакты</Link>
          </nav>
          <div className="flex">
            <a className="relative cursor-pointer rounded-full border-2 border-pink-500 bg-amber-50 m-1"
               href="https://www.instagram.com/prof_vik.elise/"
               target="_blank"
            >
              <Image className="p-2" width={45} height={45} src="/icons/instagram.svg" alt="Instagram"/>
            </a>
            <Cart/>
          </div>
        </ContentContainer>
      </div>
      <div className="flex items-center">
        <Image width={20} height={20} src="/icons/instagram.svg" alt="Instagram"/>
        <div>
          РАСХОДНЫЕ МАТЕРИАЛЫ
        </div>
        <Search/>
        <a href={`tel:${CONTACT_PHONE}`}/>

      </div>
    </header>
  );
}