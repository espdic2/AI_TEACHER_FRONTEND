import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define route access by role
const routePermissions: Record<string, string[]> = {
  // Admin-only routes
  '/dashboard/users': ['ADMIN'],
  '/dashboard/classes': ['ADMIN'],
  '/dashboard/my-classes/create': ['ADMIN'],
  
  // Professor and Admin routes
  '/dashboard/exams': ['PROFESSOR', 'ADMIN'],
  '/dashboard/my-classes': ['PROFESSOR', 'ADMIN'],
  
  // Student-only routes
  '/dashboard/my-exams': ['STUDENT'],
  '/dashboard/results': ['STUDENT'],
  
  // Mixed permissions for dynamic routes
  '/dashboard/exams/create': ['PROFESSOR', 'ADMIN'],
  '/dashboard/exams/edit': ['PROFESSOR', 'ADMIN'],
};

// Function to check if a path matches a protected route pattern
function matchesProtectedRoute(path: string): [boolean, string[]] {
  // First check exact matches
  if (routePermissions[path]) {
    return [true, routePermissions[path]];
  }
  
  // Then check dynamic routes
  for (const route in routePermissions) {
    // Skip the dashboard root
    if (route === '/dashboard') continue;
    
    // Check if the current path starts with a protected route pattern
    if (path.startsWith(route)) {
      return [true, routePermissions[route]];
    }
  }
  
  return [false, []];
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for non-dashboard routes and API routes
  if (!pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Get token from cookies or request headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1];
  
  // If no token and trying to access dashboard, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  try {
    // Decode the JWT token to get user information
    const decodedToken = jwtDecode<{ role: string }>(token);
    const userRole = decodedToken.role;
    
    // Check if the route is protected and if the user has permission
    const [isProtected, allowedRoles] = matchesProtectedRoute(pathname);
    
    if (isProtected && !allowedRoles.includes(userRole)) {
      // Redirect to 404 page if user doesn't have permission
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
    
    // Allow access if the user has permission or the route is not protected
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*',
  ],
};
