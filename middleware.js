export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/tables/:path*", 
    "/customers/:path*",
    "/api/customers/:path*",
    // "/api/tables/:path*",
    "/api/user"
  ] }