import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];

// Auth routes that only unauthenticated users can access
const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify",
  "/auth/verify-pending",
];

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // Create initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase server client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Validate session using getClaims() - the proper way to validate in middleware
  // getClaims() validates the token in storage and is safe to trust
  const { data, error } = await supabase.auth.getClaims();
  const isAuthenticated = !!data?.claims;
  console.log("[Proxy] Is Authenticated:", isAuthenticated);
  if (error) console.log("[Proxy] Auth Error:", error.message);

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => path.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // Redirect unauthenticated users away from protected pages
  if (
    protectedRoutes.some((route) => path.startsWith(route)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
