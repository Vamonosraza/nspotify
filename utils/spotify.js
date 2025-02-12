import { spotifyConfig } from '@/config/spotify';

export async function getSpotifyToken() {
    const basic = Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    return response.json();
}