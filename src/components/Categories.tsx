'use client'

import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/app/models';
import { RouterPath } from '@/app/enums';

interface CategoriesProps {
  categories: ICategory[];
  currentCategoryId: string | undefined;
}

export function Categories({ categories, currentCategoryId }: CategoriesProps) {
  return (
    <div>
      {
        categories.map((category) => {
          return (
            <Link
              className="flex items-center relative w-full categories-item duration-500 transition-colors hover:bg-pink-100 px-4 py-3"
              key={category.id}
              href={RouterPath.CATEGORIES + '/' + category.id}
            >
              <Image className="mr-4" width={25} height={25} src={category.imageUrl} alt={category.title}/>
              <span className={currentCategoryId === category.id ? 'font-bold' : ''}>{category.title}</span>
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