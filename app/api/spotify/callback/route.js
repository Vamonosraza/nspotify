import { NextResponse } from 'next/server';

export const GET = async (req) => {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        const redirectUri = process.env.REDIRECT_URI;
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!code) {
            return NextResponse.json(
                { error: 'Missing authorization code' },
                { status: 400 }
            );
        }

        // Token exchange request
        const tokenUrl = 'https://accounts.spotify.com/api/token';
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        };

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
        }).toString();

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Spotify API Error:', data);
            return NextResponse.json(
                { error: data.error, error_description: data.error_description },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            ...data
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
};