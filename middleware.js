// middleware.js

import { NextResponse } from 'next/server';
export async function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const loginUrl = new URL('/admin/login', req.nextUrl.origin);
  const pathname = req.nextUrl.pathname;
  // if (pathname === '/admin/login' || pathname === '/admin/signup') {
  //   return NextResponse.next(); 
  // }
  if (pathname === '/admin/login') {
    return NextResponse.next(); 
  }

    if (pathname.startsWith('/admin/', "/admin")) {
      if (token && typeof token === 'string') {
        try {
          const verifyResponse = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
  
          const verifyData = await verifyResponse.json();
  
          if (verifyData.valid) {
            return NextResponse.next();
          } else {
            return NextResponse.redirect(loginUrl);
          }
        } catch (error) {
          // console.error('JWT verification failed:', error);
          return NextResponse.redirect(loginUrl);
        }
      } else {
        // console.error('Token is not available');
        return NextResponse.redirect(loginUrl);
      }
    }
  
    return NextResponse.next();
  }
  
  export const config = {
    matcher: ['/admin/:path*'],
    runtime: 'nodejs',
  };