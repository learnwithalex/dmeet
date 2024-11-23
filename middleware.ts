import { NextResponse, NextRequest } from 'next/server';
import { parse } from 'cookie'; // To parse cookies on the server side

const protectedRoute = [
  '/',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/recordings',
  '/personal-room',
];

const checkICPAuth = (req: NextRequest) => {
  // Parse cookies from request headers
  const cookies = parse(req.headers.get('cookie') || '');
  const userPrincipal = cookies.userPrincipal;

  if (!userPrincipal) {
    return null;
  }

  // Perform ICP validation if needed (checking if the user is authenticated)
  return userPrincipal;
};

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // Skip redirect if already on login page
  if (pathname === '/icp-auth') {
    return NextResponse.next();
  }
  if (protectedRoute.some((route) => req.nextUrl.pathname.match(route))) {
    const user = checkICPAuth(req);

    if (!user) {
      return NextResponse.redirect(new URL('/icp-auth', req.url));
    }
  }

  return NextResponse.next(); // Proceed with the request
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
