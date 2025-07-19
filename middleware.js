import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isMFARoute = createRouteMatcher(["/account/manage-mfa/add(.*)"]);
const isSignInRoute = createRouteMatcher(["/sign-in(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (userId && isSignInRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  if (userId && !isMFARoute(req)) {
    if (sessionClaims?.isMfa === undefined) {
      console.error("You need to add the `isMfa` claim to your session token.");
    } else if (sessionClaims?.isMfa === false) {
      return NextResponse.redirect(new URL("/account/manage-mfa/add", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
