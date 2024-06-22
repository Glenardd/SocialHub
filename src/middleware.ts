import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest, response: NextResponse) {
    const data = request.cookies.get('isLogged');
    const passResetToken = request.cookies.get('token');
    const isLogged = data?.value;

    if (isLogged) {
        // Redirect away from unprotected routes
        if (!request.nextUrl.pathname.startsWith('/account')) {
            return NextResponse.redirect(new URL('/account', request.url));
        };
        
    }
    else if(!isLogged) {
        // Redirect away from protected routes
        if (request.nextUrl.pathname.startsWith('/account')) {
            return NextResponse.redirect(new URL('/signin', request.url));
        };
    };

}

export const config = {
    matcher: ["/", "/signup", "/account", "/forgot-password","/forgot-password/user", "/account/:path*"],
};
