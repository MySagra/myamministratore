"use client";

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function SessionErrorHandler({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError" && pathname !== "/login") {
      router.push("/login");
    }
  }, [session, router, pathname]);

  return <>{children}</>;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={4 * 60} refetchOnWindowFocus={true}>
      <SessionErrorHandler>{children}</SessionErrorHandler>
    </NextAuthSessionProvider>
  );
}
