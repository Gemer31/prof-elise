import './loader.css';

export interface ILoaderProps {
    styleClass?: string;
}

export function Loader({ styleClass }: ILoaderProps) {
    return (
        <div className={'loader border-2 border-custom-red-100 h-full aspect-square ' + styleClass}></div>
    )
}