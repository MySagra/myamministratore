import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Auth] Refresh token failed:", response.status, errorData);
      throw new Error("Refresh token failed");
    }

    const data = await response.json();
    console.log("[Auth] Token refreshed successfully");

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + (data.expiresIn || 3600) * 1000,
    };
  } catch (error) {
    console.error("[Auth] Refresh access token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("[Auth] Login failed:", response.status, errorData);
            return null;
          }

          const data = await response.json();

          if (!data.accessToken) {
            console.error("[Auth] No access token in response");
            return null;
          }

          console.log("[Auth] Login successful, has refresh token:", !!data.refreshToken);

          return {
            id: String(data.user?.id || "1"),
            name: data.user?.username || (credentials.username as string),
            email: `${credentials.username}@myamministratore.local`,
            token: data.accessToken,
            refreshToken: data.refreshToken || null,
            role: data.user?.role || "admin",
            expiresIn: data.expiresIn || 3600,
          };
        } catch (error) {
          console.error("[Auth] Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        return {
          ...token,
          accessToken: (user as any).token,
          refreshToken: (user as any).refreshToken || null,
          accessTokenExpires: Date.now() + ((user as any).expiresIn || 3600) * 1000,
          id: user.id,
          role: (user as any).role,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to refresh it if we have a refresh token
      if (token.refreshToken) {
        console.log("[Auth] Access token expired, attempting refresh");
        return refreshAccessToken(token);
      }

      // No refresh token available, return token as is (will trigger re-login)
      console.warn("[Auth] Access token expired but no refresh token available");
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: false,
});
