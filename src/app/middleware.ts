import { NextRequest, NextResponse } from 'next/server';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebaseModule';

export function middleware(request: NextRequest) {
  // if (request.nextUrl.pathname.startsWith('/about')) {
  //   return NextResponse.rewrite(new URL('/about-2', request.url))
  // }
  //
  // if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  // }

  console.log("!!!!!!!!!!!!!!!!!");
  return NextResponse.next();
}