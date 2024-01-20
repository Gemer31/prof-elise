import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ButtonType } from '@/app/enums';
import { Category, Product } from '@/app/models';

export interface EntityCardProps {
  category?: Category;
  product?: Product;
}
export function EntityCard({ category, product }: EntityCardProps) {

  const addToCart = () => {

  }

  const getNavLink = () => {
    return `/${category?.navigationPage || product?.category.navigationPage}`
  }

  return (
    <Link
      href={category?.navigationPage || '/'}
      className="p-4 rounded-md hover:bg-pink-100"
    >
      <Image width={200} height={200} src={category?.image || product?.image || ''} alt={category?.name || product?.name || ''}/>
      <div>{category?.name || product?.name}</div>
      {
        product
          ? (
            <>
              <div>{product.price}</div>
              <Button type={ButtonType.BUTTON} callback={addToCart}>
                В корзину
              </Button>
            </>
          )
          : <></>
      }
    </Link>
  )
}