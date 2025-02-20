// utils/spotify.js

export const getSpotifyProfile = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch('/api/spotify/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return await response.json();
};

// utils/spotify.js

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

let accessToken = null;
let tokenExpiryTime = null;

const getAccessToken = async () => {
    // If there's an access token and it's not expired, return it
    if (accessToken && new Date().getTime() < tokenExpiryTime) {
        return accessToken;
    }

    // Otherwise, request a new access token
    const tokenData = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET,
        }),
    }).then((res) => res.json());

    accessToken = tokenData.access_token;
    tokenExpiryTime = new Date().getTime() + (tokenData.expires_in - 60) * 1000; // Token expires in seconds, subtract 60 seconds buffer

    return accessToken;
};



// utils/spotify.js
const getSearchAccessToken = async () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
};

export const searchSpotify = async (query) => {
    try {
        const accessToken = await getSearchAccessToken();
        
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Spotify');
        }

        return await response.json();
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};

export const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
};

