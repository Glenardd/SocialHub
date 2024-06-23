import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest, response: NextResponse) {
    const data = request.cookies.get("isLogged");
    const isLogged = data?.value;

    if (isLogged) {
        // Redirect away from unprotected routes
        if (!request.nextUrl.pathname.startsWith("/home") && !request.nextUrl.pathname.startsWith("/account")) {
            return NextResponse.redirect(new URL("/home", request.url));
        };

        // console.log("Request: ",request.nextUrl.pathname.startsWith("/account"));
        
    }
    else if (!isLogged) {
        // Redirect away from unprotected routes
        if (request.nextUrl.pathname.startsWith("/home") || request.nextUrl.pathname.startsWith("/account")) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

}

export const config = {
    matcher: ["/", "/signup", "/account", "/forgot-password","/forgot-password/user", "/account/:path*", "/home"],
};
