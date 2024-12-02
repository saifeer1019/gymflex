import { NextResponse } from 'next/server';
import axios from 'axios';

export async function middleware(req) {
  // Manually parse cookies from the request headers
  const cookieHeader = req.headers.get('cookie');
  const cookies = Object.fromEntries(cookieHeader?.split('; ').map(cookie => {
    const [name, value] = cookie.split('=');
    return [name, decodeURIComponent(value)];
  }) || []);

  const token = cookies.auth_token;

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url)); // Redirect to auth if no token
  }

  try {
    // Verify the token and get user role
    const response = await axios.get('http://localhost:3000/api/auth/verify', {
      headers: {
        Authorization: `${token}`,
      },
    });

    const role = response.data.role;

    // Check the requested path and user role
    const { pathname, method } = req.nextUrl;

    // Protect POST requests to /api/users for admin only
    if (pathname.startsWith('/api/users') && method === 'POST' && (role !== 'admin' )) {
      return NextResponse.redirect(new URL('/login', req.url)); // Redirect if not admin
    }

    // Allow GET requests to /api/users for anyone
    if (pathname.startsWith('/api/users') && method === 'GET') {
      return NextResponse.next(); // Allow access for GET requests
    }

    if (pathname.startsWith('/api/classes') && method === 'POST' && (role !== 'admin' && role !== 'trainer')) {
      return NextResponse.redirect(new URL('/login', req.url)); // Redirect if not admin
    }
    // Protect other routes based on role
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url)); // Redirect if not admin
    }

  

    if (pathname.startsWith('/api/book') && role !== 'trainee') {
      return NextResponse.redirect(new URL('/login', req.url)); // Redirect if not trainee
    }

    if (pathname.startsWith('/api/users/[id]') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url)); // Redirect if not admin
    }

  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.redirect(new URL('/auth', req.url)); // Redirect to auth on error
  }

  // If the token exists and role is valid, proceed to the next middleware or handler
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/trainer/:path*', '/trainee/:path*', '/api/users/:path*', '/api/book/:path*', '/api/classes/:path*', '/api/users/[id]'], // Apply middleware to these routes
};