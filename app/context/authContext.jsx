'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSpotifyProfile } from '../../utils/spotify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from Spotify
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                setAccessToken(token); // Store access token in state
                const profileData = await getSpotifyProfile(token);
                setUser(profileData);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle user login and fetch profile
    const login = async () => {
        await fetchUserProfile();
    };

    // Clear auth data on logout
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expirey');
        setUser(null);
        setAccessToken(null);
    };

    // Fetch profile on initial load
    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

