import { RequestCallPopup } from '@/components/RequestCallPopup';
import { Notification } from '@/components/Notification';
import { Header } from '@/components/Header';
import { SubHeader } from '@/components/SubHeader';
import { Slider } from '@/components/slider/Slider';
import { ContentContainer } from '@/components/ContentContainer';
import { ViewedRecently } from '@/components/viewed-recently/ViewedRecently';
import { Footer } from '@/components/Footer';
import { ICommonProps, IConfig } from '@/app/models';

interface IBasePageProps extends ICommonProps {
  sliderVisible?: boolean;
  config: IConfig;
}

export function BasePage({config, sliderVisible, children}: IBasePageProps) {
  return <>
    <RequestCallPopup/>
    <Notification/>
    <div id="page" className="relative flex flex-col items-center h-full z-10">
      <Header/>
      <SubHeader config={config}/>
      {sliderVisible ? <Slider/> : <></>}
      <ContentContainer id="content" styleClass="w-full flex justify-start px-2">
        {children}
      </ContentContainer>
      <ViewedRecently config={config}/>
      <Footer config={config}/>
    </div>
  </>
}