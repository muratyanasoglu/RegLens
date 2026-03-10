import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sources/:path*",
    "/updates/:path*",
    "/controls/:path*",
    "/tasks/:path*",
    "/evidence/:path*",
    "/audit-packs/:path*",
    "/frameworks/:path*",
    "/compliance/:path*",
    "/security/:path*",
    "/settings/:path*",
    "/integrations/:path*",
    "/analytics/:path*",
    "/ai-insights/:path*",
    "/collaboration/:path*",
    "/mobile/:path*",
    "/team",
    "/team-chat",
    "/organizations",
    "/invites/:path*",
    "/friends",
    "/messages/:path*",
    "/guide",
    "/guide/:path*",
    "/docs",
    "/docs/:path*",
  ],
}
