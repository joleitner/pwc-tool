import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/supabase.middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the Next.js Intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  if (intlResponse) {
    return intlResponse;
  }

  return await updateSession(request);
}

// Combine the matchers from both configurations
export const config = {
  matcher: [
    "/",
    "/(de|en)/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth/confirm|$).*)",
  ],
};
