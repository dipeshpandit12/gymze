import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// This function can be marked `async` if using `await` inside
export function middleware(request) {

    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup';
    const isDashboardPath = path === '/dashboard' || path.startsWith('/dashboard/');
    const isRootPath = path === '' || path === '/';
    const token = request.cookies.get('token')?.value || '';

    if (token) {
      try {
          const decodedToken = jwt.decode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp < currentTime) {
              const response = NextResponse.redirect(new URL('/login', request.url));
              response.cookies.delete('token');
              return response;
          }
      } catch (error) {
          console.error('Error decoding token:', error);
      }
  }

    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(isRootPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if((isDashboardPath) && !token){
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard',
    '/dashboard/:path*'
  ]
}
