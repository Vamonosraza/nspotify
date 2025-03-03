const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export const getSpotifyProfile = async () => {
    // Get the stored access token and expiry time from localStorage
    let accessToken = localStorage.getItem('access_token');
    const tokenExpiry = localStorage.getItem('token_expiry');

    if (!accessToken) {
        return
    }

    // If the current time is past the expiry, refresh the token
    if (new Date().getTime() > tokenExpiry) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const refreshedData = await refreshAccessToken(refreshToken);
        accessToken = refreshedData.access_token;

        // Save the new access token and its expiry time (in milliseconds)
        localStorage.setItem('access_token', accessToken);
        // Subtract a buffer of 60 seconds to account for any delays
        localStorage.setItem(
            'token_expiry',
            new Date().getTime() + (refreshedData.expires_in - 60) * 1000
        );
    }

    // Use the valid access token to fetch the Spotify profile
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

const refreshAccessToken = async (refreshToken) => {
    // Build the form data required by Spotify for refreshing tokens
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', SPOTIFY_CLIENT_ID);
    params.append('client_secret', SPOTIFY_CLIENT_SECRET);

    const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    return await response.json();
};



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
    // Check if we have a valid token in localStorage
    const storedToken = localStorage.getItem('search_access_token');
    const tokenExpiry = localStorage.getItem('search_token_expiry');

    if (storedToken && new Date().getTime() < tokenExpiry) {
        return storedToken;
    }

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
    localStorage.setItem('search_access_token', data.access_token);
    localStorage.setItem('search_token_expiry', new Date().getTime() + (data.expires_in - 60) * 1000);
    return data.access_token;
};


export async function searchSpotify(query, type = 'track', offset = 0, limit = 20) {
    try {
        // Get a valid access token (will refresh if needed)
        const token = await getSearchAccessToken();
        
        if (!token) {
            throw new Error('No access token available');
        }

        // Build the search URL with type parameter
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&offset=${offset}&limit=${limit}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Handle 401 Unauthorized specifically - token might be invalid
            if (response.status === 401) {
                return searchSpotify(query, type, offset, limit);
            }
            
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to search Spotify');
        }

        return await response.json();
    } catch (error) {
        console.error('Spotify search error:', error);
        throw error;
    }
}

// Function to fetch more results for pagination
export async function fetchMoreResults(nextUrl) {
    try {
        // Get a valid access token (will refresh if needed)
        const token = await getSearchAccessToken();
        
        if (!token) {
            throw new Error('No access token available');
        }
        
        const response = await fetch(nextUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Handle 401 Unauthorized specifically
            if (response.status === 401) {
                
                return fetchMoreResults(nextUrl);
            }
            
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch more results');
        }

        return await response.json();
    } catch (error) {
        console.error('Spotify fetch more error:', error);
        throw error;
    }
}

// Helper to load the next page of results
export async function loadNextPage(results, type, currentOffset = 0, limit = 20) {
    if (!results || !results[`${type}s`] || !results[`${type}s`].next) {
        return results;
    }
    
    try {
        const nextResults = await fetchMoreResults(results[`${type}s`].next);
        
        // Combine the new results with the existing ones
        const updatedResults = { ...results };
        updatedResults[`${type}s`].items = [
            ...updatedResults[`${type}s`].items,
            ...nextResults[`${type}s`].items
        ];
        updatedResults[`${type}s`].next = nextResults[`${type}s`].next;
        
        return updatedResults;
    } catch (error) {
        console.error('Failed to load next page:', error);
        return results;
    }
}

export const formatDuration = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const formattedMinutes = String(minutes).padStart(2, "0")
    const formattedSeconds = String(seconds).padStart(2, "0")
    return `${formattedMinutes}:${formattedSeconds}`
  }

