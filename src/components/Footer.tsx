import { ContentContainer } from '@/components/ContentContainer';
import Image from 'next/image';
import { convertToClass } from '@/utils/convert-to-class.util';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { LOCALE, TRANSLATES } from '@/app/constants';
import { useAppDispatch } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';

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
        <footer className="w-full flex justify-center bg-pink-300 mt-4">
            <ContentContainer>
                <div className="flex ">
                    <div>
                        <h2>Информация</h2>
                    </div>
                    <div>
                        <h2>Контакты</h2>
                    </div>
                    <div>
                        <a className={instagramClass}
                           href="https://www.instagram.com/prof_vik.elise/"
                           target="_blank"
                        >
                            <Image className="p-2" width={40} height={40} src="/icons/instagram.svg" alt="Instagram"/>
                        </a>
                        <Button
                          styleClass="uppercase text-amber-50"
                          type={ButtonType.BUTTON}
                          callback={() => dispatch(setRequestCallPopupVisible(true))}
                        >{TRANSLATES[LOCALE].requestCall}</Button>
                    </div>
                </div>
                <span>© 2023 prof-elise.by - Расходные материалы в Могилеве</span>
            </ContentContainer>
        </footer>
    )
}