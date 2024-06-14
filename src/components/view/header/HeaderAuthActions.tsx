import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { RouterPath } from '@/app/enums';
import { CircleButton } from '@/components/ui/CircleButton';

export function HeaderAuthActions() {
  const session = useSession();

  return session?.data?.user ? (
    <>
      <CircleButton styleClass="size-14 flex justify-center items-center">
        <Link className="" href={RouterPath.PROFILE}>
          <Image
            className="p-2"
            width={45}
            height={45}
            src="/icons/user.svg"
            alt="Profile"
          />
        </Link>
      </CircleButton>
      <CircleButton
        styleClass="size-14 flex justify-center items-center cursor-pointer"
        onClick={() => signOut({ callbackUrl: RouterPath.HOME })}
      >
        <Image
          className="p-2"
          width={45}
          height={45}
          src="/icons/sign-out.svg"
          alt="Log out"
        />
      </CircleButton>
    </>
  ) : (
    <>
      <CircleButton styleClass="size-14 flex justify-center items-center">
        <Link className="" href={RouterPath.SIGN_IN}>
          <Image
            className="p-2"
            width={45}
            height={45}
            src="/icons/sign-in.svg"
            alt="Sigh in"
          />
        </Link>
      </CircleButton>
    </>
  );
}
