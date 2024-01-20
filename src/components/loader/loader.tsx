import './loader.css';

export interface ILoaderProps {
    styleClass: string;
}

export function Loader({ styleClass }: ILoaderProps) {
    return (
        <span className={'loader border-2 border-custom-red-100 ' + styleClass}></span>
    )
}