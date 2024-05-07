export interface ILoaderProps {
    styleClass?: string;
}

export function Loader({ styleClass }: ILoaderProps) {
    return (
        <div className={'loader border-2 aspect-square ' + styleClass}></div>
    )
}