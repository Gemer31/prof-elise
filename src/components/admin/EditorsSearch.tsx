import { SearchInput } from '@/components/ui/SearchInput';

export interface IEditorsSearchProps {
  onChange: (searchValue: string) => void;
}

export function EditorsSearch({onChange}: IEditorsSearchProps) {
  return <div className="sticky top-0 p-2 bg-pink-500">
    <SearchInput onChange={onChange}/>
  </div>;
}