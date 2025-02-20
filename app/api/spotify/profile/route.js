// app/api/spotify/profile/route.js
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    const accessToken = req.headers.get('Authorization')?.split(' ')[1]; // Extract the token from Authorization header

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error: error.error.message }, { status: response.status });
    }

    const userData = await response.json();

    return NextResponse.json(userData);  // Return the user data
};
