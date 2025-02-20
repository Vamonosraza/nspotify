// app/api/spotify/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    const access_token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!access_token) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Error fetching Spotify profile:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }
}
