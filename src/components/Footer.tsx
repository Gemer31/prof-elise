import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { useAppDispatch } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import Link from 'next/link';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { CONTACT_PHONE } from '@/app/constants';

export function Footer() {
  const dispatch = useAppDispatch();
  const instagramClass: string = convertToClass([
    'flex',
    'justify-center',
    'items-center',
    'rounded-full',
    'border-2',
    'border-pink-500',
    'bg-amber-50',
    'm-1',
    'size-12',
    'hover:bg-pink-100',
    'duration-500',
    'transition-colors'
  ]);

  return (
    <footer className="w-full flex justify-center bg-pink-300">
      <ContentContainer styleClass="pt-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl mb-4">Информация</h2>
            <div>
              <Link className="" href="/delivery">{TRANSLATES[LOCALE].delivery}</Link>
            </div>
          </div>
          <div>
            <h2 className="text-xl mb-4">Контакты</h2>
            <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
          </div>
          <div className="flex flex-col items-center">
            <Button
              styleClass="uppercase text-amber-50"
              type={ButtonType.BUTTON}
              callback={() => dispatch(setRequestCallPopupVisible(true))}
            >{TRANSLATES[LOCALE].requestCall}</Button>
            <a className={instagramClass}
               href="https://www.instagram.com/prof_vik.elise/"
               target="_blank"
            >
              <Image className="p-2" width={40} height={40} src="/icons/instagram.svg" alt="Instagram"/>
            </a>
          </div>
        </div>
        <div className="text-xs text-center py-4">© 2023 prof-elise.by - Расходные материалы в Могилеве</div>
      </ContentContainer>
    </footer>
  );
}