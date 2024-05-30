import { RequestCallPopup } from '@/components/view/RequestCallPopup';
import { Notification } from '@/components/ui/Notification';
import { Header } from '@/components/view/Header';
import { SubHeader } from '@/components/view/SubHeader';
import { Slider } from '@/components/view/slider/Slider';
import { ViewedRecently } from '@/components/view/viewed-recently/ViewedRecently';
import { Footer } from '@/components/view/Footer';
import { ICommonProps, IConfig, IViewedRecently } from '@/app/models';

interface IBasePageProps extends ICommonProps {
  sliderVisible?: boolean;
  config: IConfig;
  viewedRecently: IViewedRecently[];
}

export function BasePage({config, sliderVisible, viewedRecently, children}: IBasePageProps) {
  return <>
    <RequestCallPopup/>
    <Notification/>
    <div id="page" className="relative flex flex-col items-center h-full z-10">
      <Header/>
      <SubHeader config={config}/>
      {sliderVisible ? <Slider/> : <></>}
      {children}
      <ViewedRecently
        viewedRecently={viewedRecently}
        config={config}
      />
      <Footer config={config}/>
    </div>
  </>;
}