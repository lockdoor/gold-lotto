export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard", "/tables/:path*", "/customers/:path*"] }