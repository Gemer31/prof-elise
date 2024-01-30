'use client';

import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Button } from '@/components/Button';
import { ButtonType, FirebaseCollections, RouterPath } from '@/app/enums';
import { useAppDispatch } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import Link from 'next/link';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { usePathname } from 'next/navigation';
import { getDocData } from '@/utils/firebase-collections.util';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { useEffect } from 'react';

export interface FooterProps {
  firestoreData?: Array<QueryDocumentSnapshot>;
}

export function Footer({ firestoreData }: FooterProps) {
  const contactPhone: string = getDocData(firestoreData, FirebaseCollections.CONFIG)?.['contactPhone'].stringValue;

  useEffect(() => {
    console.log(firestoreData);
  }, [contactPhone]);

  const dispatch = useAppDispatch();
  const pathname = usePathname();
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
    <footer className="w-full mt-4 flex justify-center bg-pink-300">
      <ContentContainer>
        {
          pathname === RouterPath.LOGIN || pathname === RouterPath.EDITOR
            ? <></>
            : <div className="flex justify-between pt-4">
              <div>
                <h2 className="text-xl mb-4">Информация</h2>
                <div>
                  <Link className="" href="/delivery">{TRANSLATES[LOCALE].delivery}</Link>
                </div>
              </div>
              <div>
                <h2 className="text-xl mb-4">Контакты</h2>
                {/*<a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>*/}
                <a>{contactPhone}</a>
              </div>
              <div className="flex flex-col items-center">
              <Button
                  styleClass="uppercase text-amber-50 px-4 py-2"
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
        }
        <div className="text-xs text-center py-4">© 2023 prof-elise.by - Расходные материалы в Могилеве</div>
      </ContentContainer>
    </footer>
  );
}