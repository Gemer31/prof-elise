import { CommonProps } from '@/app/models';



export function Button({ children }: CommonProps) {
  return (
    <button className="flex justify-center items-center px-4 py-2 bg-pink-500">{children}</button>
  )
}