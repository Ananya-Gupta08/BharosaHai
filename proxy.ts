import {clerkMiddleware} from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import {routing} from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware((_auth, request) => intlMiddleware(request));

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
