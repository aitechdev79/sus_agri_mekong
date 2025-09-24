import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

const authMiddleware = withAuth(
  function onSuccess() {
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only for ADMIN and MODERATOR roles
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN' || token?.role === 'MODERATOR';
        }
        return true;
      },
    },
  }
);

export default function middleware(req: NextRequest) {
  // Skip all middleware for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return;
  }

  const publicPaths = ['/auth/signin', '/auth/signup'];
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (isPublicPath) {
    return;
  }

  return (authMiddleware as typeof authMiddleware)(req);
}

export const config = {
  // Match only internationalized pathnames and protected routes
  matcher: ['/((?!_next|favicon.ico|uploads).*)']
};