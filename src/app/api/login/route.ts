import { cookies, headers } from 'next/headers';
import { customInitApp } from '@/app/lib/firebase-admin-config';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';

customInitApp();

export async function POST(request: NextRequest, response: NextResponse) {
    const authorization = headers().get("Authorization");
    if (authorization?.startsWith("Bearer ")) {
        const idToken = authorization.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(idToken);

        if (decodedToken) {
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            const sessionCookie = await auth().createSessionCookie(idToken, {
                expiresIn,
            });
            const options = {
                name: "session",
                value: sessionCookie,
                maxAge: expiresIn,
                httpOnly: true,
                secure: true,
            };

            cookies().set(options);
        }
    }

    return NextResponse.json({}, { status: 200 });
}

export async function GET(request: NextRequest) {
    const session = cookies().get("session")?.value || "";

    if (!session) {
        return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    const decodedClaims = await auth().verifySessionCookie(session, true);
    if (!decodedClaims) {
        return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    return NextResponse.json({ isLogged: true }, { status: 200 });
}