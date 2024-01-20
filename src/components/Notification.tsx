import { convertToClass } from '@/utils/convert-to-class.util';

export function Notification({ message, styleClass }: { message: string, styleClass: string }) {
    const styleClasses: string = convertToClass([
        styleClass || 'hidden',
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
        <div className={styleClasses}>{message}</div>
    )
}