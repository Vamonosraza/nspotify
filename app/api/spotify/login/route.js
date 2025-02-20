// app/api/spotify/login/route.js
import { NextResponse } from 'next/server';

export const GET = async () => {
    // Define the required parameters for the Spotify authorization URL
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    console.log(clientId);
    const redirectUri = process.env.REDIRECT_URI;
    console.log(redirectUri);
    const scope = 'user-library-read user-read-email';  // Add required scopes based on what you want

    // Create the Spotify authorization URL
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    // Redirect the user to the authorization URL
    return NextResponse.redirect(authUrl);
};
