import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { RouterPath } from '@/app/enums';

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("session");

  if (!session && request.nextUrl.pathname === RouterPath.EDITOR) {
    return NextResponse.redirect(new URL(RouterPath.MAIN, request.url));
  }

  // path.join(process.cwd(), 'app', 'api', 'login')
  const responseAPI = await fetch('http://localhost:3000/api/login', {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });

  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL(RouterPath.MAIN, request.url));
  }

  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ["/editor"],
};