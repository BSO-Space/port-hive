// src/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';

export interface ExtendedNextRequest extends NextRequest {
    user?: { username: string };
}

export function basicAuth(req: ExtendedNextRequest) {

    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return new NextResponse(null, { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="PortHive"' } });
    }

    const [authType, token] = authHeader ? authHeader.split(' ') : [undefined, undefined];

    if (authType !== 'Basic' || !token) {
        return new NextResponse(JSON.stringify({ message: 'Invalid authorization format' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const decodedToken = Buffer.from(token, 'base64').toString();
    const [username, password] = decodedToken.split(':');

    if (
        username !== process.env.BASIC_AUTH_USER ||
        password !== process.env.BASIC_AUTH_PASSWORD
    ) {
        return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    req.user = { username }; // Store the username for later use in the request
    return true; // If authenticated, return true
}