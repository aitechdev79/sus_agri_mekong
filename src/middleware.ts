import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // withAuth middleware function
  function middleware(req) {
    // Custom logic can go here if needed
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Skip all middleware for API routes
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return true;
        }

        // Allow public paths
        const publicPaths = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/about-us',
          '/join-us',
          '/members',
          '/news',
          '/stories',
          '/library',
          '/content',
          '/guidance-policy',
          '/vi', // Internationalized routes
          '/en'
        ];
        const isPublicPath = publicPaths.some(path =>
          req.nextUrl.pathname === path ||
          req.nextUrl.pathname.startsWith(path + '/')
        );

        if (isPublicPath) {
          return true;
        }

        // Allow access to admin routes only for ADMIN and MODERATOR roles
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN' || token?.role === 'MODERATOR';
        }

        // For other protected routes, just require a valid token
        return !!token;
      },
    },
  }
);

export const config = {
  // Match only internationalized pathnames and protected routes
  matcher: ['/((?!_next|favicon.ico|uploads).*)']
};