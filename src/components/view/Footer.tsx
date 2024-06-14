import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ContentContainer } from '@/components/ui/ContentContainer';
import { convertToClass } from '@/utils/convert-to-class.util';
import { LOCALE, TRANSLATES } from '@/app/translates';
import { IConfig } from '@/app/models';
import { transformPhoneUtil } from '@/utils/transform-phone.util';
import { CircleButton } from '@/components/ui/CircleButton';
import { RequestCallButton } from '@/components/view/RequestCallButton';
import { SITE_HEADER_LINKS } from '@/app/constants';

export interface IFooterProps {
  config: IConfig;
}

const PAYMENTS_IMGS = ['belkart.svg', 'erip.svg', 'visa.svg'];

export function Footer({ config }: IFooterProps) {
  const infoClass: string = useMemo(
    () =>
      convertToClass([
        'flex',
        'flex-col sm:flex-row',
        'justify-between',
        'pt-4',
      ]),
    []
  );
  const buttonsClass: string = useMemo(
    () =>
      convertToClass([
        'flex',
        'flex-row-reverse sm:flex-col',
        'justify-around',
        'items-center',
        'basis-1/3',
      ]),
    []
  );

  return (
    <footer className="w-full flex justify-center bg-pink-300">
      <ContentContainer styleClass="px-2">
        <div className={infoClass}>
          <div
            className="mb-4 sm:mb-0 text-xs basis-1/3"
            dangerouslySetInnerHTML={{
              __html: config.shopRegistrationDescription,
            }}
          />
          <div className="mb-4 sm:mb-0 flex flex-col items-center basis-1/3">
            <div>
              {SITE_HEADER_LINKS.map(([path, translateCode]) => (
                <Link className="text-lg" key={path} href={path}>
                  <h2>{TRANSLATES[LOCALE][translateCode]}</h2>
                </Link>
              ))}
            </div>
          </div>
          <div className={buttonsClass}>
            <div>
              <div className="flex items-center gap-x-2">
                <CircleButton
                  styleClass="size-8"
                  href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}
                >
                  <Image
                    className="p-2"
                    width={35}
                    height={35}
                    src="/icons/phone.svg"
                    alt="Phone"
                  />
                </CircleButton>
                <a
                  href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}
                >
                  {config?.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-x-2">
                <CircleButton
                  styleClass="size-8"
                  href={`tel:${transformPhoneUtil(config?.contactPhone || '')}`}
                >
                  <Image
                    className="p-2"
                    width={35}
                    height={35}
                    src="/icons/clock.svg"
                    alt="Working hours"
                  />
                </CircleButton>
                {config?.workingHours}
              </div>
              <div className="flex items-center gap-x-2">
                <CircleButton
                  styleClass="size-8"
                  target="_blank"
                  href="https://www.instagram.com/prof_vik.elise/"
                >
                  <Image
                    className="p-2"
                    width={45}
                    height={45}
                    src="/icons/instagram.svg"
                    alt="Instagram"
                  />
                </CircleButton>
                <RequestCallButton />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-x-4 mt-2">
          {PAYMENTS_IMGS.map((url) => (
            <Image
              key={url}
              width={60}
              height={60}
              src={`/payments/${url}`}
              alt={url}
            />
          ))}
        </div>
        <div className="text-xs text-center py-4">
          © 2024 prof-elise.by - Расходные материалы в Могилеве
        </div>
      </ContentContainer>
    </footer>
  );
}
