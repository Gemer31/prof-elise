import Link from 'next/link';
import Image from 'next/image';
import { ContentContainer } from '@/components/ContentContainer';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';
import { ButtonType, RouterPath } from '@/app/enums';
import { useAppDispatch } from '@/store/store';
import { setRequestCallPopupVisible } from '@/store/dataSlice';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig } from '@/app/models';
import { transformPhoneUtil } from '@/utils/transform-phone.util';

interface ISubHeaderProps {
  firestoreConfigData?: IConfig;
}

export function SubHeader({firestoreConfigData}: ISubHeaderProps) {
  const dispatch = useAppDispatch();
  const pathname: string = usePathname();

  return pathname === RouterPath.LOGIN || pathname === RouterPath.EDITOR
    ? <></>
    : <ContentContainer styleClass="flex justify-between items-center mb-2">
      <Link className="w-3/12 flex justify-center items-center" href={RouterPath.MAIN}>
        <Image className="rounded-full" width={150} height={150} src="/images/logo.jpg" alt="Instagram"/>
      </Link>
      <div className="w-8/12 flex justify-between items-center">
        <div className="uppercase text-center w-20 font-bold">{TRANSLATES[LOCALE].сonsumables}</div>
        {/*<Search/>*/}
        <div className="text-center font-bold">
          <a
            href={`tel:${transformPhoneUtil(firestoreConfigData?.contactPhone || '')}`}>{firestoreConfigData?.contactPhone}</a>
          <div>{firestoreConfigData?.workingHours}</div>
        </div>
        <Button
          styleClass="uppercase text-amber-50 px-4 py-2"
          type={ButtonType.BUTTON}
          callback={() => dispatch(setRequestCallPopupVisible(true))}
        >{TRANSLATES[LOCALE].requestCall}</Button>
      </div>
    </ContentContainer>;
}