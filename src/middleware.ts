import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest, response: NextResponse) {
  // const session = request.cookies.get("session");
  // console.log("sessionMiddleware: ", session);
  //
  // if (!session && request.nextUrl.pathname === RouterPath.EDITOR) {
  //   return NextResponse.redirect(new URL(RouterPath.HOME, request.url));
  // }
  //
  // const responseAPI = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_ENDPOINT}/api/login`, {
  //   headers: {
  //     Cookie: `session=${session?.value}`,
  //   },
  // });
  //
  // if (responseAPI.status !== 200 && request.nextUrl.pathname === RouterPath.EDITOR) {
  //   return NextResponse.redirect(new URL(RouterPath.HOME, request.url));
  // }
  // if (responseAPI.status === 200 && request.nextUrl.pathname === RouterPath.LOGIN) {
  //   return NextResponse.redirect(new URL(RouterPath.EDITOR, request.url));
  // }
  return NextResponse.next();
}

// export const config = {
//   matcher: ["/editor", "/login"],
// };