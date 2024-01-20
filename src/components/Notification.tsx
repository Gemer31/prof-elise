import { convertToClass } from '@/utils/convert-to-class.util';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';
import { FADE_IN_LEFT_CLASS, FADE_IN_RIGHT_CLASS } from '@/app/constants';
import { setNotificationMessage } from '@/store/dataSlice';

export function Notification() {
    const dispatch = useAppDispatch();
    const message = useAppSelector(state => state.dataReducer.notificationMessage);
    const [animationClass, setAnimationClass] = useState<string>();

    useEffect(() => {
        if (message) {
            setAnimationClass(FADE_IN_RIGHT_CLASS);
            setTimeout(() => {
                dispatch(setNotificationMessage(null));
                setAnimationClass(FADE_IN_LEFT_CLASS);
            }, 5000);
        }
    }, [message]);

    const styleClasses: string = convertToClass([
        'fixed',
        'px-3',
        'py-1',
        'border-2',
        'border-custom-yellow-200',
        'rounded-2xl',
        'top-3',
        'right-4',
        'bg-custom-gray-100',
        'z-20',
    ]);

    return (
        <div className={styleClasses + animationClass}>{message}</div>
    )
}