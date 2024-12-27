import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {

    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup';
    const isDashboardPath = path === '/dashboard' || path.startsWith('/dashboard/');
    const token = request.cookies.get('token')?.value || '';

    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if((isDashboardPath) && !token){
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard',
    '/dashboard/:path*'
  ]
}
