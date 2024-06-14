export interface ILoaderProps {
  className?: string;
}

export function Loader({ className }: ILoaderProps) {
  return <div className={'loader border-2 aspect-square ' + className}></div>;
}
