import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebaseModule';
import { RouterPath } from '@/app/enums';
import { useRouter } from 'next/navigation';

export default function EditorPage() {
  // const router = useRouter();
  // const [user, loading] = useAuthState(auth);
  // if (user) {
  //   return (
  //     <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">
  //
  //     </main>
  //   )
  // } else {
  //   router.push(RouterPath.MAIN);
  // }

  return (
    <main className="w-full max-w-screen-lg flex flex-col items-center overflow-x-hidden lg:overflow-x-visible">

    </main>
  )
}