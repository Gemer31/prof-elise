import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/app/models';
import { RouterPath } from '@/app/enums';

interface CategoriesProps {
  categories: ICategory[];
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <div>
      {
        categories.map((category) => {
          return (
            <Link
              className="flex items-center relative w-full h-10 categories-item duration-500 transition-colors hover:bg-pink-100 px-4"
              key={category.id}
              href={RouterPath.CATEGORIES + '/' + category.id}
            >
              <Image className="mr-4" width={25} height={25} src={category.imageUrl} alt={category.title}/>
              <span>{category.title}</span>
              {/*{*/}
              {/*  category.categories?.length*/}
              {/*    ? (<div>*/}
              {/*      {*/}
              {/*        category.categories.map((innerCategory) => {*/}
              {/*          return (*/}
              {/*            <Link*/}
              {/*              className="flex relative w-20"*/}
              {/*              key={category.id}*/}
              {/*              href={'/' + category.navigationPage}*/}
              {/*            >*/}
              {/*              <Image className="mr-4" width={30} height={30} src={category.icon} alt={category.name}/>*/}
              {/*              <span>{category.name}</span>*/}
              {/*              {*/}
              {/*                category.categories?.length*/}
              {/*                  ?*/}
              {/*                  :*/}
              {/*              }*/}
              {/*            </Link>*/}
              {/*          )*/}
              {/*        })*/}
              {/*      }*/}
              {/*    </div>)*/}
              {/*    :*/}
              {/*}*/}
            </Link>
          )
        })
      }
    </div>
  )
}