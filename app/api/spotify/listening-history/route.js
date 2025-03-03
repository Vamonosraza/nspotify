import { NextResponse } from 'next/server';

// Function to fetch listening history from Spotify
async function fetchListeningHistory(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch listening history');
    }

    const data = await response.json();
 
    return data.items.map(item => ({
        artist: item.track.artists[0].name,
        title: item.track.name,
        album: item.track.album.name,
        playedAt: item.played_at,
        albumArt: item.track.album.images[0]?.url,
    }));
}

// API handler function
export async function GET(request) {
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
        return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    try {
        const history = await fetchListeningHistory(accessToken);
        return NextResponse.json(history);
    } catch (error) {
        console.error('Error fetching listening history:', error);
        return NextResponse.json({ error: 'Failed to fetch listening history' }, { status: 500 });
    }
}
