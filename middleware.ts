import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      if (token) return true;

      return false;
    },
  },

  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/users/:path*", "/conversations/:path*"],
};
