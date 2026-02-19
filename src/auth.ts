import NextAuth, { type DefaultSession, type User, type Profile } from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/lib/env";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user, profile }: { token: JWT; user?: User; profile?: Profile }) {
      // Використовуємо sub як найбільш стабільний ідентифікатор Google
      if (profile) {
        token.id = profile.sub;
        token.picture = profile.picture;
      } else if (user) {
        token.id = user.id;
        token.picture = user.image;
      }
      
      // Запасний варіант, якщо id все ще не встановлено
      if (!token.id && token.sub) {
        token.id = token.sub;
      }

      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = (token.id ?? token.sub) as string;
        session.user.image = (token.picture as string | null) ?? undefined;
        
        // Лог для діагностики на сервері (видно в терміналі)
        console.log("Auth Session:", { 
          id: session.user.id, 
          hasImage: !!session.user.image,
          imageUrl: session.user.image?.substring(0, 30) + "..."
        });
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/tasks") || nextUrl.pathname === "/";
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
});
