import { useEffect, useState } from 'react';
import './header-counter.css';

const TIMEOUT: number = 150;

enum HeaderCounterAnimationNames {
  SLIDE_UP = 'header-counter-slide-up',
  SLIDE_DOWN = 'header-counter-slide-down',
  DISAPPEAR = 'header-counter-disappear',
  APPEAR = 'header-counter-appear',
}

interface IHeaderCouterProps {
  value: number;
}

export function HeaderCounter({value}: IHeaderCouterProps) {
  const [hostAnimationClass, setHostAnimationClass] = useState<string>('');
  const [numbersAnimationClass, setNumbersAnimationClass] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number>();
  const [currentValue, setCurrentValue] = useState<number>();
  const [nextValue, setNextValue] = useState<number>();

  useEffect(() => {
    const oldValue = Number(currentValue);

    if (oldValue && !value) {
      setHostAnimationClass(HeaderCounterAnimationNames.DISAPPEAR);
      setTimeout(() => {
        setCurrentValue(value);
      }, TIMEOUT);
    } else if (!oldValue && value) {
      setHostAnimationClass(HeaderCounterAnimationNames.APPEAR);
      setCurrentValue(value);
    } else if (value > oldValue) {
      setNextValue(value);
      setNumbersAnimationClass(HeaderCounterAnimationNames.SLIDE_UP);
      setTimeout(() => {
        setNextValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(value);
      }, TIMEOUT);
    } else if (value < oldValue) {
      setPrevValue(value);
      setNumbersAnimationClass(HeaderCounterAnimationNames.SLIDE_DOWN);
      setTimeout(() => {
        setPrevValue(undefined);
        setNumbersAnimationClass('');
        setCurrentValue(value);
      }, TIMEOUT);
    }
  }, [value]);

  return <div className={'header-counter ' + hostAnimationClass}>
    <div className={'header-counter-numbers ' + numbersAnimationClass}>
      {nextValue ? <div>{nextValue}</div> : <></>}
      <div>{currentValue}</div>
      {prevValue ? <div>{prevValue}</div> : <></>}
    </div>
  </div>;
}