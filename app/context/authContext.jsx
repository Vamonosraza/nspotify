'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSpotifyProfile } from '../../utils/spotify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const profileData = await getSpotifyProfile();
                setUser(profileData); // Set user immediately after fetching profile
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false); // End loading after fetching data
        }
    };

    const login = async () => {
        // On login, update the user data by fetching the profile
        await fetchUserProfile();
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null); // Clear user on logout
    };

    useEffect(() => {
        fetchUserProfile(); // Fetch user profile when the app first loads
    }, []); 

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

