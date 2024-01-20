import { CATEGORIES } from '@/app/constants';
import Link from 'next/link';
import Image from 'next/image';

export function Categories() {
  return (
    <div>
      {
        CATEGORIES.map((category) => {
          return (
            <Link
              className="flex relative w-20"
              key={category.id}
              href={'/' + category.navigationPage}
            >
              <Image className="mr-4" width={30} height={30} src={category.image} alt={category.name}/>
              <span>{category.name}</span>
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