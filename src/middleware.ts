// import { RouterPath } from '@/app/enums';
//
// export { default } from 'next-auth/middleware'
//
// export const config = {
//   matcher: [RouterPath.PROFILE],
// };

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest, response: NextResponse) {
  return NextResponse.next();
}
